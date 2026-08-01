import { ITEMS, TOKEN, USER, expect, loginAs, test } from './fixtures/api';

const ADDRESS = 'Calle Mayor 12, 3ºB';

/**
 * El carrito vive sólo en el store de NgRx, en memoria: no se persiste. Ir al
 * carrito con page.goto() recarga la app entera y lo vacía. Hay que navegar
 * como lo haría una persona, con el botón del carrito en la navbar.
 */
async function goToCart(page: import('@playwright/test').Page) {
  // exact: true porque "Carrito" es subcadena de "Añadir al carrito" y
  // "Quitar del carrito", y getByRole hace match parcial por defecto.
  await page.getByRole('button', { name: 'Carrito', exact: true }).click();
  await expect(page).toHaveURL('/cart');
}

test.describe('Flujo de compra', () => {
  test('login → añadir al carrito → checkout', async ({ page, api }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(USER.email);
    await page.getByLabel('Contraseña').fill('un-password-valido');
    await page.getByRole('button', { name: 'Enviar' }).click();

    // Tras el login se vuelve a la home con el catálogo cargado.
    await expect(page).toHaveURL('/');
    const margarita = page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name });
    await expect(margarita).toBeVisible();

    // La tarjeta de producto sólo añade/quita una unidad (alterna entre los
    // dos estados); subir de una a más unidades se hace desde el carrito.
    await margarita.getByRole('button', { name: 'Añadir al carrito' }).click();

    const hamburguesa = page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[1].name });
    await hamburguesa
      .getByRole('button', { name: 'Añadir al carrito' })
      .click();

    await goToCart(page);

    const margaritaRow = page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name });
    await margaritaRow
      .getByRole('button', { name: 'Añadir una unidad' })
      .click();

    // (8 * 2) + 5 = 21
    await expect(page.getByText('21 EUR')).toBeVisible();

    await page.getByLabel('Dirección de entrega').fill(ADDRESS);
    await page.getByRole('button', { name: 'Realizar pedido' }).click();

    await expect(
      page.getByText('El pedido se ha realizado correctamente')
    ).toBeVisible();
    await expect(page).toHaveURL('/');

    // Lo que de verdad importa: qué se envió al backend.
    expect(api.createdOrders).toHaveLength(1);
    const order = api.createdOrders[0];
    expect(order.address).toBe(ADDRESS);
    expect(order.items).toEqual(
      expect.arrayContaining([
        { item: ITEMS[0]._id, quantity: 2 },
        { item: ITEMS[1]._id, quantity: 1 },
      ])
    );
    expect(order.items).toHaveLength(2);
  });

  test('el carrito permite cambiar la cantidad antes de pedir', async ({
    page,
    api,
  }) => {
    await loginAs(page);
    await page.goto('/');

    const margarita = page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name });
    await margarita.getByRole('button', { name: 'Añadir al carrito' }).click();

    await goToCart(page);

    const cartRow = page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name });
    await cartRow.getByRole('button', { name: 'Añadir una unidad' }).click();
    await cartRow.getByRole('button', { name: 'Añadir una unidad' }).click();
    await expect(cartRow.getByLabel('Cantidad')).toHaveValue('3');

    await cartRow.getByRole('button', { name: 'Quitar una unidad' }).click();
    await expect(cartRow.getByLabel('Cantidad')).toHaveValue('2');

    await page.getByLabel('Dirección de entrega').fill(ADDRESS);
    await page.getByRole('button', { name: 'Realizar pedido' }).click();

    await expect(
      page.getByText('El pedido se ha realizado correctamente')
    ).toBeVisible();
    expect(api.createdOrders[0].items).toEqual([
      { item: ITEMS[0]._id, quantity: 2 },
    ]);
  });

  // Destructura `api` aunque no se use en el cuerpo: basta con nombrarla
  // para que Playwright instale el mock y no golpeemos un backend real.
  test('no se puede pedir sin dirección de entrega', async ({ page, api }) => {
    await loginAs(page);
    await page.goto('/');

    await page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name })
      .getByRole('button', { name: 'Añadir al carrito' })
      .click();

    await goToCart(page);

    await expect(
      page.getByRole('button', { name: 'Realizar pedido' })
    ).toBeDisabled();
  });

  test('si falla la creación del pedido, el carrito no se vacía', async ({
    page,
    api,
  }) => {
    await loginAs(page);
    await page.goto('/');

    await page
      .locator('app-item-card')
      .filter({ hasText: ITEMS[0].name })
      .getByRole('button', { name: 'Añadir al carrito' })
      .click();

    await goToCart(page);
    await page.getByLabel('Dirección de entrega').fill(ADDRESS);

    api.failNextOrder();
    await page.getByRole('button', { name: 'Realizar pedido' }).click();

    // Seguimos en el carrito y el producto continúa ahí para poder reintentar.
    await expect(page).toHaveURL('/cart');
    await expect(
      page.locator('app-item-card').filter({ hasText: ITEMS[0].name })
    ).toBeVisible();
  });
});

test.describe('Acceso', () => {
  test('el carrito exige haber iniciado sesión', async ({ page, api }) => {
    await page.goto('/cart');

    await expect(page).toHaveURL('/login');
  });

  test('unas credenciales incorrectas no inician sesión', async ({
    page,
    api,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(USER.email);
    await page.getByLabel('Contraseña').fill('wrong-password');
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page).toHaveURL('/login');
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  test('se puede entrar directamente por URL a una ruta que no sea la home', async ({
    page,
    api,
  }) => {
    // Regresión: el toast navegaba a "/" en su primer render, así que
    // entrar directo a cualquier URL rebotaba a la home.
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
    await expect(
      page.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeVisible();
  });

  test('la sesión guardada se restaura sin perder la URL a la que se entró', async ({
    page,
    api,
  }) => {
    // Regresión: restaurar la sesión al arrancar reutilizaba la misma acción
    // que un login real, y su efecto navegaba siempre a "/". Entrar con la
    // sesión ya guardada a una URL que no fuera la home rebotaba igual que
    // hacía el toast.
    await loginAs(page);
    await page.goto('/cart');

    await expect(page).toHaveURL('/cart');
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBe(
      TOKEN
    );
  });
});
