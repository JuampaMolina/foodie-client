import { createReducer, on } from '@ngrx/store';
import { ItemsState } from '../interface/items-state';
import {
  createItem,
  createItemError,
  createItemSuccess,
  deleteItem,
  deleteItemError,
  deleteItemSuccess,
  getItems,
  getItemsByCategoryId,
  getItemsByCategoryIdError,
  getItemsByCategoryIdSuccess,
  getItemsError,
  getItemsSuccess,
  updateItem,
  updateItemError,
  updateItemSuccess,
} from './items.actions';

export const itemsInitalState: ItemsState = {
  items: [],
  loading: false,
  loaded: false,
  error: '',
  message: '',
};

export const itemsReducer = createReducer(
  itemsInitalState,

  on(getItems, state => ({
    ...state,
    loading: true,
    loaded: false,
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
    loaded: false,
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
  })),

  on(createItem, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(createItemError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(createItemSuccess, (state, { item }) => ({
    ...state,
    loading: false,
    loaded: true,
    items: [...state.items, item],
  })),

  on(updateItem, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(updateItemError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(updateItemSuccess, (state, { item }) => ({
    ...state,
    loading: false,
    loaded: true,
    items: state.items.map(i => (i._id === item._id ? item : i)),
  })),

  on(deleteItem, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(deleteItemError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(deleteItemSuccess, (state, { item }) => ({
    ...state,
    loading: false,
    loaded: true,
    items: state.items.filter(i => i._id !== item._id),
  }))
);
