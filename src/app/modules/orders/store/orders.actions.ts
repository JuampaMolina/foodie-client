import { createAction, props } from '@ngrx/store';
import { Item } from '../../items/interface/item';
import { CreateOrderCommand } from '../interface/createOrderCommand';
import { Order } from '../interface/order';
import { UpdateOrderStatusCommand } from '../interface/updateOrderStatusCommand';

export const getOrders = createAction(
  '[Orders] getOrders',
  props<{ page?: number; limit?: number }>()
);
export const getOrdersError = createAction(
  '[Orders] getOrdersError',
  props<{ error: any }>()
);
export const getOrdersSuccess = createAction(
  '[Orders] getOrdersSuccess',
  props<{ orders: Order[]; page: number; total: number; totalPages: number }>()
);

export const getOrdersByUserId = createAction(
  '[Orders] getOrdersByUserId',
  props<{ userId: string }>()
);
export const getOrdersByUserIdError = createAction(
  '[Orders] getOrdersByUserIdError',
  props<{ error: any }>()
);
export const getOrdersByUserIdSuccess = createAction(
  '[Orders] getOrdersByUserIdSuccess',
  props<{ orders: Order[] }>()
);

export const createOrder = createAction(
  '[Orders] createOrder',
  props<{ order: CreateOrderCommand }>()
);
export const createOrderError = createAction(
  '[Orders] createOrderError',
  props<{ error: any }>()
);
export const createOrderSuccess = createAction(
  '[Orders] createOrderSuccess',
  props<{ order: Order }>()
);

export const updateOrderStatus = createAction(
  '[Orders] updateOrderStatus',
  props<{ statusUpdate: UpdateOrderStatusCommand }>()
);
export const updateOrderStatusError = createAction(
  '[Orders] updateOrderStatusError',
  props<{ error: any }>()
);
export const updateOrderStatusSuccess = createAction(
  '[Orders] updateOrderStatusSuccess',
  props<{ order: Order }>()
);

export const addItemToCart = createAction(
  '[Orders] addItemToOrder',
  props<{ item: Item }>()
);

export const removeItemFromCart = createAction(
  '[Orders] removeItemFromCart',
  props<{ itemId: string }>()
);
