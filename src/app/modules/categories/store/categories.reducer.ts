import { createReducer, on } from '@ngrx/store';
import { getCategories, getCategoriesError, getCategoriesSuccess, createCategory, createCategoryError, createCategorySuccess } from './categories.actions';
import { CategoriesState } from '../interface/category-state';

export const categoriesInitalState: CategoriesState = {
  categories: [],
  loading: false,
  loaded: false,
  error: undefined
};

export const categoriesReducer = createReducer(
  categoriesInitalState,

  on(getCategories, (state) => ({
    ...state,
    loading: true,
  })),

  on(getCategoriesError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message
  })),

  on(getCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    loaded: true,
    categories: categories
  }))
)
