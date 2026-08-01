import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCategoriesError } from '../modules/categories/store/categories.selectors';
import { selectItemsError } from '../modules/items/store/items.selectors';
import {
  selectOrdersError,
  selectOrdersMessage,
} from '../modules/orders/store/orders.selectors';
import { selectUsersError } from '../modules/users/store/users.selectors';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let router: jasmine.SpyObj<Router>;

  const createFixture = (
    overrides: {
      message?: string;
      ordersError?: string;
    } = {}
  ): ComponentFixture<ToastComponent> => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectItemsError, value: '' },
            { selector: selectOrdersError, value: overrides.ordersError ?? '' },
            { selector: selectCategoriesError, value: '' },
            { selector: selectUsersError, value: '' },
            { selector: selectOrdersMessage, value: overrides.message ?? '' },
          ],
        }),
        { provide: Router, useValue: router },
      ],
    });

    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('shows a store message without navigating anywhere', () => {
    // Regresión: handleMessage navegaba a "/" con cualquier mensaje no
    // vacío, rebotando a un admin fuera de /admin/pedidos cada vez que
    // llegaba una notificación de pedido por WebSocket.
    const fixture = createFixture({ message: 'Nuevo pedido de Ana' });
    expect(fixture.componentInstance.message()).toBe('Nuevo pedido de Ana');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('redirects to /login when a session expires', () => {
    createFixture({ ordersError: 'jwt expired' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('does not navigate for a regular error', () => {
    createFixture({ ordersError: 'boom' });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
