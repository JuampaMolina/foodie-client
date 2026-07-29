import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Order } from '../interface/order';
import { OrdersState } from '../interface/orders-state';
import {
  addItemToCart,
  createOrder,
  createOrderError,
  createOrderSuccess,
  getOrders,
  getOrdersByUserId,
  getOrdersByUserIdError,
  getOrdersByUserIdSuccess,
  getOrdersError,
  getOrdersSuccess,
  removeItemFromCart,
} from './orders.actions';

export const ordersAdapter = createEntityAdapter<Order>({
  selectId: order => order._id,
  sortComparer: (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
});

export const ordersInitalState: OrdersState = ordersAdapter.getInitialState({
  cart: [],
  loading: false,
  loaded: false,
  error: '',
  message: '',
});

export const ordersReducer = createReducer(
  ordersInitalState,

  on(getOrders, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(getOrdersError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(getOrdersSuccess, (state, { orders }) =>
    ordersAdapter.setAll(orders, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(getOrdersByUserId, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(getOrdersByUserIdError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(getOrdersByUserIdSuccess, (state, { orders }) =>
    ordersAdapter.setAll(orders, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(createOrder, state => ({
    ...state,
    loading: true,
    loaded: false,
    error: '',
    message: '',
  })),

  on(createOrderError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(createOrderSuccess, (state, { order }) =>
    ordersAdapter.addOne(order, {
      ...state,
      loading: false,
      loaded: true,
      message: 'El pedido se ha realizado correctamente',
      cart: [],
    })
  ),

  on(addItemToCart, (state, { item }) => ({
    ...state,
    cart: [...state.cart, item].sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    ),
  })),

  on(removeItemFromCart, (state, { itemId }) => {
    let index = state.cart.findIndex(item => item._id === itemId);
    let cart = [...state.cart.slice(0, index), ...state.cart.slice(index + 1)];

    return {
      ...state,
      cart: cart.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      ),
    };
  })
);
