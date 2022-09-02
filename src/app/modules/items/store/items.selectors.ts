import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { ItemsState } from '../interface/items-state';

const _selectItemsState = (state: AppState): ItemsState => state.items;

export const selectItemsState = createSelector(
  _selectItemsState,
  (state: ItemsState) => state
);

export const selectItemsMessage = createSelector(
  _selectItemsState,
  (state: ItemsState) => state.message
);

export const selectItemsError = createSelector(
  _selectItemsState,
  (state: ItemsState) => state.error
);

export const selectItemsLoading = createSelector(
  _selectItemsState,
  (state: ItemsState) => state.loading
);

export const selectItems = createSelector(
  _selectItemsState,
  (state: ItemsState) => state.items
);
