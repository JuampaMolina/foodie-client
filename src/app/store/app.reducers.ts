import { ActionReducerMap } from '@ngrx/store';
import { ItemsState } from '../modules/items/interface/items-state';
import { itemsReducer } from '../modules/items/store/items.reducer';
import { CategoriesState } from '../modules/categories/interface/categories-state';
import { categoriesReducer } from '../modules/categories/store/categories.reducer';
import { ordersReducer } from '../modules/orders/store/orders.reducer';
import { OrdersState } from '../modules/orders/interface/orders-state';
import { UsersState } from '../modules/users/interface/UsersState';
import { usersReducer } from '../modules/users/store/users.reducer';

export interface AppState {
  items: ItemsState;
  categories: CategoriesState;
  orders: OrdersState;
  users: UsersState;
}

export const appReducers: ActionReducerMap<AppState> = {
  items: itemsReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  users: usersReducer,
};
