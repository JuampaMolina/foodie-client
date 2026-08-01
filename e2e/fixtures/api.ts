import { Page, Route, test as base } from '@playwright/test';

/**
 * La API se intercepta en el borde de red en vez de levantar el backend real,
 * que necesitaría MongoDB. Los tests cubren entonces todo el frontend —
 * routing, guards, NgRx, effects, formularios y componentes — contra un
 * contrato con la misma forma que el del servidor.
 *
 * Contrapartida consciente: esto no valida que el backend siga cumpliendo ese
 * contrato. Si cambia, hay que tocar este fichero (y sólo este).
 */

const API = 'http://localhost:3000';

export const CATEGORIES = [
  { _id: 'c1', name: 'Pizza', image: 'assets/categories/pizza.svg' },
  { _id: 'c2', name: 'Hamburguesa', image: 'assets/categories/burger.svg' },
];

export const ITEMS = [
  {
    _id: 'i1',
    name: 'Pizza Margarita',
    description: 'Tomate, mozzarella y albahaca fresca',
    price: 8,
    category: CATEGORIES[0],
  },
  {
    _id: 'i2',
    name: 'Hamburguesa Clásica',
    description: 'Hamburguesa con queso cheddar y bacon',
    price: 5,
    category: CATEGORIES[1],
  },
];

export const USER = {
  _id: 'u1',
  name: 'Lucía Fernández',
  email: 'lucia@example.com',
  role: 'user' as const,
};

export const TOKEN = 'e2e-token';

/** Pedidos creados durante el test, para poder afirmar sobre lo que se envió. */
export interface CreatedOrder {
  items: { item: string; quantity: number }[];
  address: string;
}

export interface ApiMock {
  createdOrders: CreatedOrder[];
  /** Hace que el siguiente POST /orders falle, para probar el camino de error. */
  failNextOrder(): void;
}

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

export async function mockApi(page: Page): Promise<ApiMock> {
  const createdOrders: CreatedOrder[] = [];
  let orderShouldFail = false;

  const mock: ApiMock = {
    createdOrders,
    failNextOrder: () => {
      orderShouldFail = true;
    },
  };

  await page.route(`${API}/**`, async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (method === 'OPTIONS') {
      return route.fulfill({ status: 204, body: '' });
    }

    if (path === '/categories' && method === 'GET') {
      return json(route, CATEGORIES);
    }

    if (path.startsWith('/items/category/') && method === 'GET') {
      const categoryId = path.split('/').pop();
      return json(
        route,
        ITEMS.filter(item => item.category._id === categoryId)
      );
    }

    if (path === '/items' && method === 'GET') {
      return json(route, ITEMS);
    }

    if (path === '/users/login' && method === 'POST') {
      const body = request.postDataJSON() as {
        email: string;
        password: string;
      };
      if (body.password === 'wrong-password') {
        return json(route, { message: 'Credenciales incorrectas' }, 401);
      }
      return json(route, {
        user: { ...USER, email: body.email },
        token: TOKEN,
      });
    }

    if (path === '/orders' && method === 'POST') {
      if (orderShouldFail) {
        orderShouldFail = false;
        return json(route, { message: 'No se pudo crear el pedido' }, 500);
      }
      const body = request.postDataJSON() as CreatedOrder;
      createdOrders.push(body);
      const totalPrice = body.items.reduce((sum, line) => {
        const item = ITEMS.find(candidate => candidate._id === line.item);
        return sum + (item?.price ?? 0) * line.quantity;
      }, 0);
      return json(route, {
        _id: 'o1',
        totalPrice,
        date: new Date().toISOString(),
        address: body.address,
        status: 'pending',
        user: USER,
        items: body.items.map(line => ({
          item: ITEMS.find(candidate => candidate._id === line.item),
          quantity: line.quantity,
        })),
      });
    }

    if (path.startsWith('/orders/user/') && method === 'GET') {
      return json(route, []);
    }

    if (path === '/orders' && method === 'GET') {
      return json(route, {
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      });
    }

    // Cualquier ruta no contemplada se hace visible en vez de fallar en silencio.
    return json(route, { message: `Sin mock para ${method} ${path}` }, 501);
  });

  return mock;
}

/** Deja la sesión iniciada sin pasar por el formulario de login. */
export async function loginAs(
  page: Page,
  user: typeof USER = USER
): Promise<void> {
  await page.addInitScript(
    ([storedUser, storedToken]) => {
      localStorage.setItem('user', storedUser);
      localStorage.setItem('token', storedToken);
    },
    [JSON.stringify(user), TOKEN]
  );
}

export const test = base.extend<{ api: ApiMock }>({
  api: async ({ page }, use) => {
    const mock = await mockApi(page);
    await use(mock);
  },
});

export { expect } from '@playwright/test';
