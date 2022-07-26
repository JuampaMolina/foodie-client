import { createReducer, on } from '@ngrx/store';
import {
  getItems,
  getItemsError,
  getItemsSuccess,
  createItem,
  createItemError,
  createItemSuccess,
  getItemsByCategoryId,
  getItemsByCategoryIdError,
  getItemsByCategoryIdSuccess,
} from './items.actions';
import { ItemsState } from '../interface/items-state';

export const itemsInitalState: ItemsState = {
  items: [],
  loading: false,
  loaded: false,
  error: undefined,
};

export const itemsReducer = createReducer(
  itemsInitalState,

  on(getItems, state => ({
    ...state,
    loading: true,
  })),

  on(getItemsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(getItemsSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    loaded: true,
    items: items,
  })),

  on(getItemsByCategoryId, state => ({
    ...state,
    loading: true,
  })),

  on(getItemsByCategoryIdError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(getItemsByCategoryIdSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    loaded: true,
    items: items,
  }))
);
