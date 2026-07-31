import { Item } from '../../items/interface/item';
import { Order } from '../interface/order';
import {
  addItemToCart,
  cancelOrderError,
  cancelOrderSuccess,
  createOrderSuccess,
  getOrders,
  getOrdersError,
  getOrdersSuccess,
  removeItemFromCart,
  setCartItemQuantity,
  updateOrderStatusSuccess,
} from './orders.actions';
import {
  ordersAdapter,
  ordersInitalState,
  ordersReducer,
} from './orders.reducer';

const { selectAll } = ordersAdapter.getSelectors();

describe('ordersReducer', () => {
  const order: Order = {
    _id: '1',
    totalPrice: 20,
    date: new Date('2026-01-01'),
  };
  const burger: Item = { _id: 'b', name: 'Burger', description: '', price: 10 };
  const apple: Item = {
    _id: 'a',
    name: 'Apple pie',
    description: '',
    price: 5,
  };

  it('should return the initial state for an unknown action', () => {
    const state = ordersReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(ordersInitalState);
  });

  it('should set loading on getOrders', () => {
    const state = ordersReducer(ordersInitalState, getOrders({}));
    expect(state.loading).toBeTrue();
  });

  it('should set the error message on getOrdersError', () => {
    const state = ordersReducer(
      ordersInitalState,
      getOrdersError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should populate orders and pagination metadata on getOrdersSuccess', () => {
    const state = ordersReducer(
      ordersInitalState,
      getOrdersSuccess({ orders: [order], page: 2, total: 15, totalPages: 2 })
    );
    expect(selectAll(state)).toEqual([order]);
    expect(state.page).toBe(2);
    expect(state.total).toBe(15);
    expect(state.totalPages).toBe(2);
  });

  it('should append the order and empty the cart on createOrderSuccess', () => {
    const state = ordersReducer(
      { ...ordersInitalState, cart: [burger] },
      createOrderSuccess({ order })
    );
    expect(selectAll(state)).toEqual([order]);
    expect(state.cart).toEqual([]);
    expect(state.message).toBe('El pedido se ha realizado correctamente');
  });

  it('should add an item to the cart sorted by name', () => {
    let state = ordersReducer(
      ordersInitalState,
      addItemToCart({ item: burger })
    );
    state = ordersReducer(state, addItemToCart({ item: apple }));
    expect(state.cart.map(i => i._id)).toEqual(['a', 'b']);
  });

  it('should remove the matching item from the cart', () => {
    const state = ordersReducer(
      { ...ordersInitalState, cart: [apple, burger] },
      removeItemFromCart({ itemId: 'a' })
    );
    expect(state.cart).toEqual([burger]);
  });

  it('should update the matching order on updateOrderStatusSuccess', () => {
    const updated: Order = { ...order, status: 'preparing' };
    const seeded = ordersAdapter.setAll([order], ordersInitalState);
    const state = ordersReducer(
      seeded,
      updateOrderStatusSuccess({ order: updated })
    );
    expect(selectAll(state)).toEqual([updated]);
  });

  it('should update the matching order on cancelOrderSuccess', () => {
    const cancelled: Order = { ...order, status: 'cancelled' };
    const seeded = ordersAdapter.setAll([order], ordersInitalState);
    const state = ordersReducer(
      seeded,
      cancelOrderSuccess({ order: cancelled })
    );
    expect(selectAll(state)).toEqual([cancelled]);
  });

  it('should set the error message on cancelOrderError', () => {
    const state = ordersReducer(
      ordersInitalState,
      cancelOrderError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should set the exact quantity of an item in the cart', () => {
    const state = ordersReducer(
      { ...ordersInitalState, cart: [apple, burger] },
      setCartItemQuantity({ item: burger, quantity: 3 })
    );
    expect(state.cart.map(i => i._id)).toEqual(['a', 'b', 'b', 'b']);
  });

  it('should remove the item from the cart when quantity is set to 0', () => {
    const state = ordersReducer(
      { ...ordersInitalState, cart: [apple, burger] },
      setCartItemQuantity({ item: burger, quantity: 0 })
    );
    expect(state.cart).toEqual([apple]);
  });
});
