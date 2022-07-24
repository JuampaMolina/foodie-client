import { ActionReducerMap } from '@ngrx/store';
import { ItemsState } from '../modules/items/interface/items-state';
import { itemsReducer } from '../modules/items/store/items.reducer';

export interface AppState {
  items: ItemsState
}

export const appReducers: ActionReducerMap<AppState> = {
  items: itemsReducer
}
