import { createReducer, on } from '@ngrx/store';
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

export const ordersInitalState: OrdersState = {
  orders: [],
  cart: [],
  loading: false,
  loaded: false,
  error: '',
  message: '',
};

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

  on(getOrdersSuccess, (state, { orders }) => ({
    ...state,
    loading: false,
    loaded: true,
    orders: orders,
  })),

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

  on(getOrdersByUserIdSuccess, (state, { orders }) => ({
    ...state,
    loading: false,
    loaded: true,
    orders: orders,
  })),

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

  on(createOrderSuccess, (state, { order }) => ({
    ...state,
    loading: false,
    loaded: true,
    orders: [...state.orders, order],
    message: 'El pedido se ha realizado correctamente',
    cart: [],
  })),

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
