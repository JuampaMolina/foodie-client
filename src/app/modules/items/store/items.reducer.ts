import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Item } from '../interface/item';
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

export const itemsAdapter = createEntityAdapter<Item>({
  selectId: item => item._id,
});

export const itemsInitalState: ItemsState = itemsAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: '',
  message: '',
});

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

  on(getItemsSuccess, (state, { items }) =>
    itemsAdapter.setAll(items, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

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

  on(getItemsByCategoryIdSuccess, (state, { items }) =>
    itemsAdapter.setAll(items, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

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

  on(createItemSuccess, (state, { item }) =>
    itemsAdapter.addOne(item, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

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

  on(updateItemSuccess, (state, { item }) =>
    itemsAdapter.upsertOne(item, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

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

  on(deleteItemSuccess, (state, { item }) =>
    itemsAdapter.removeOne(item._id, {
      ...state,
      loading: false,
      loaded: true,
    })
  )
);
