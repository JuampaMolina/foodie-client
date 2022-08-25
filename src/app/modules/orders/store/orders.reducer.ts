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
  cart: [
    // {
    //   _id: '62f91cae8c35d8245d3cb172',
    //   name: 'Agua con Gas',
    //   description: 'Agua con gas',
    //   price: 2,
    //   category: {
    //     _id: '62f9191cb0d4fa314b35414b',
    //     name: 'Bebidas',
    //   },
    // },
    // {
    //   _id: '62f91cae8c35d8245d3cb172',
    //   name: 'Agua con Gas',
    //   description: 'Agua con gas',
    //   price: 2,
    //   category: {
    //     _id: '62f9191cb0d4fa314b35414b',
    //     name: 'Bebidas',
    //   },
    // },
    // {
    //   _id: '62f91cae8c35d8245d3cb172',
    //   name: 'Agua con Gas',
    //   description: 'Agua con gas',
    //   price: 2,
    //   category: {
    //     _id: '62f9191cb0d4fa314b35414b',
    //     name: 'Bebidas',
    //   },
    // },
    // {
    //   _id: '62f91cae8c35d8245d3cb172',
    //   name: 'Agua con Gas',
    //   description: 'Agua con gas',
    //   price: 2,
    //   category: {
    //     _id: '62f9191cb0d4fa314b35414b',
    //     name: 'Bebidas',
    //   },
    // },
  ],
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
