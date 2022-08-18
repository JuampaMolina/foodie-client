import { createReducer, on } from '@ngrx/store';
import {
  getOrders,
  getOrdersError,
  getOrdersSuccess,
  getOrdersByUserId,
  getOrdersByUserIdError,
  getOrdersByUserIdSuccess,
  createOrder,
  createOrderError,
  createOrderSuccess,
  addItemToCart,
  removeItemFromCart,
} from './orders.actions';
import { OrdersState } from '../interface/orders-state';
import { Item } from '../../items/interface/item';

export const ordersInitalState: OrdersState = {
  orders: [],
  cart: [],
  loading: false,
  loaded: false,
  error: undefined,
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
  })),

  on(addItemToCart, (state, { item }) => ({
    ...state,
    cart: [...state.cart, item],
  })),

  on(removeItemFromCart, (state, { itemId }) => {
    const cart: Item[] = JSON.parse(JSON.stringify(state.cart));
    const index = cart.findIndex(item => item._id === itemId);
    cart.splice(index, 1);

    return {
      ...state,
      cart: cart,
    };
  })
);
