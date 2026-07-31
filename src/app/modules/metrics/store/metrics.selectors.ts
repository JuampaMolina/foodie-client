import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { MetricsState } from '../interface/metrics-state';

const _selectMetricsState = (state: AppState): MetricsState => state.metrics;

export const selectSalesByDay = createSelector(
  _selectMetricsState,
  (state: MetricsState) => state.salesByDay
);

export const selectSalesByDayLoading = createSelector(
  _selectMetricsState,
  (state: MetricsState) => state.salesByDayLoading
);

export const selectTopItems = createSelector(
  _selectMetricsState,
  (state: MetricsState) => state.topItems
);

export const selectTopItemsLoading = createSelector(
  _selectMetricsState,
  (state: MetricsState) => state.topItemsLoading
);
