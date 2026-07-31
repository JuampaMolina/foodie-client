import { createAction, props } from '@ngrx/store';
import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { TopItem } from '../interface/topItem';

export const getSalesByDay = createAction(
  '[Metrics] getSalesByDay',
  props<{ days?: number }>()
);
export const getSalesByDayError = createAction(
  '[Metrics] getSalesByDayError',
  props<{ error: any }>()
);
export const getSalesByDaySuccess = createAction(
  '[Metrics] getSalesByDaySuccess',
  props<{ salesByDay: SalesByDayPoint[] }>()
);

export const getTopItems = createAction(
  '[Metrics] getTopItems',
  props<{ limit?: number }>()
);
export const getTopItemsError = createAction(
  '[Metrics] getTopItemsError',
  props<{ error: any }>()
);
export const getTopItemsSuccess = createAction(
  '[Metrics] getTopItemsSuccess',
  props<{ topItems: TopItem[] }>()
);
