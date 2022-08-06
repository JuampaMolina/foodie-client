import { createAction, props } from '@ngrx/store';
import { Item } from '../interface/item';
import { CreateItemCommand } from '../interface/createItemCommand';
import { UpdateItemCommand } from '../interface/updateItemCommand';

export const getItems = createAction('[Items] getItems');
export const getItemsError = createAction(
  '[Items] getItemsError',
  props<{ error: any }>()
);
export const getItemsSuccess = createAction(
  '[Items] getItemsSuccess',
  props<{ items: Item[] }>()
);

export const getItemsByCategoryId = createAction(
  '[Items] getItemsByCategoryId',
  props<{ categoryId: string }>()
);
export const getItemsByCategoryIdError = createAction(
  '[Items] getItemsByCategoryIdError',
  props<{ error: any }>()
);
export const getItemsByCategoryIdSuccess = createAction(
  '[Items] getItemsByCategoryIdSuccess',
  props<{ items: Item[] }>()
);

export const createItem = createAction(
  '[Items] createItem',
  props<{ item: CreateItemCommand }>()
);
export const createItemError = createAction(
  '[Items] createItemError',
  props<{ error: any }>()
);
export const createItemSuccess = createAction(
  '[Items] createItemSuccess',
  props<{ item: Item }>()
);

export const updateItem = createAction(
  '[Items] updateItem',
  props<{ itemUpdate: UpdateItemCommand }>()
);
export const updateItemError = createAction(
  '[Items] updateItemError',
  props<{ error: any }>()
);
export const updateItemSuccess = createAction(
  '[Items] updateItemSuccess',
  props<{ item: Item }>()
);

export const deleteItem = createAction(
  '[Items] deleteItem',
  props<{ itemId: string }>()
);
export const deleteItemError = createAction(
  '[Items] deleteItemError',
  props<{ error: any }>()
);
export const deleteItemSuccess = createAction(
  '[Items] deleteItemSuccess',
  props<{ item: Item }>()
);
