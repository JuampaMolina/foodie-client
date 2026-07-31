import { createReducer, on } from '@ngrx/store';
import { MetricsState } from '../interface/metrics-state';
import {
  getSalesByDay,
  getSalesByDayError,
  getSalesByDaySuccess,
  getTopItems,
  getTopItemsError,
  getTopItemsSuccess,
} from './metrics.actions';

export const metricsInitialState: MetricsState = {
  salesByDay: [],
  salesByDayLoading: false,
  salesByDayError: undefined,
  topItems: [],
  topItemsLoading: false,
  topItemsError: undefined,
};

export const metricsReducer = createReducer(
  metricsInitialState,

  on(getSalesByDay, state => ({
    ...state,
    salesByDayLoading: true,
    salesByDayError: undefined,
  })),

  on(getSalesByDayError, (state, { error }) => ({
    ...state,
    salesByDayLoading: false,
    salesByDayError: error.message,
  })),

  on(getSalesByDaySuccess, (state, { salesByDay }) => ({
    ...state,
    salesByDayLoading: false,
    salesByDay,
  })),

  on(getTopItems, state => ({
    ...state,
    topItemsLoading: true,
    topItemsError: undefined,
  })),

  on(getTopItemsError, (state, { error }) => ({
    ...state,
    topItemsLoading: false,
    topItemsError: error.message,
  })),

  on(getTopItemsSuccess, (state, { topItems }) => ({
    ...state,
    topItemsLoading: false,
    topItems,
  }))
);
