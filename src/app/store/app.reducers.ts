import { ActionReducerMap } from '@ngrx/store';
import { ItemsState } from '../modules/items/interface/items-state';
import { itemsReducer } from '../modules/items/store/items.reducer';
import { CategoriesState } from '../modules/categories/interface/category-state';
import { categoriesReducer } from '../modules/categories/store/categories.reducer';

export interface AppState {
  items: ItemsState,
  categories: CategoriesState
}

export const appReducers: ActionReducerMap<AppState> = {
  items: itemsReducer,
  categories: categoriesReducer
}
