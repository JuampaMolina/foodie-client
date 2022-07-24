import { createAction, props } from '@ngrx/store';
import { Item } from '../interface/item';

export const getItems = createAction('[Items] getItems');
export const getItemsError = createAction('[Items] getItemsError', props<{ error: any }>());
export const getItemsSuccess = createAction('[Items] getItemsSuccess', props<{ items: Item[] }>());

export const createItem = createAction('[Items] createItem');
export const createItemError = createAction('[Items] createItemError', props<{ error: any }>());
export const createItemSuccess = createAction('[Items] createItemSuccess', props<{ item: Item }>());
