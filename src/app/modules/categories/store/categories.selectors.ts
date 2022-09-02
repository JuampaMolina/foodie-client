import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { CategoriesState } from '../interface/categories-state';

const _selectCategoriesState = (state: AppState): CategoriesState =>
  state.categories;

export const selectCategoriesState = createSelector(
  _selectCategoriesState,
  (state: CategoriesState) => state
);

export const selectCategoriesMessage = createSelector(
  _selectCategoriesState,
  (state: CategoriesState) => state.message
);

export const selectCategoriesError = createSelector(
  _selectCategoriesState,
  (state: CategoriesState) => state.error
);

export const selectCategories = createSelector(
  _selectCategoriesState,
  (state: CategoriesState) => state.categories
);
