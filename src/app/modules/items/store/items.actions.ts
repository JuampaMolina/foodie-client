import { createAction, props } from '@ngrx/store';
import { Item } from '../interface/item';
import { CreateItemCommand } from '../interface/createItemCommand';

export const getItems = createAction('[Items] getItems');
export const getItemsError = createAction('[Items] getItemsError', props<{ error: any }>());
export const getItemsSuccess = createAction('[Items] getItemsSuccess', props<{ items: Item[] }>());

export const getItemsByCategoryId = createAction('[Items] getItemsByCategoryId', props<{ categoryId: string }>());
export const getItemsByCategoryIdError = createAction('[Items] getItemsByCategoryIdError', props<{ error: any }>());
export const getItemsByCategoryIdSuccess = createAction('[Items] getItemsByCategoryIdSuccess', props<{ items: Item[] }>());

export const createItem = createAction('[Items] createItem', props<{ item: CreateItemCommand }>());
export const createItemError = createAction('[Items] createItemError', props<{ error: any }>());
export const createItemSuccess = createAction('[Items] createItemSuccess', props<{ item: any }>());
