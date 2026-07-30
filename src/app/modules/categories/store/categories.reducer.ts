import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Category } from '../interface/category';
import { CategoriesState } from '../interface/categories-state';
import {
  createCategory,
  createCategoryError,
  createCategorySuccess,
  deleteCategory,
  deleteCategoryError,
  deleteCategorySuccess,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  updateCategory,
  updateCategoryError,
  updateCategorySuccess,
} from './categories.actions';

export const categoriesAdapter = createEntityAdapter<Category>({
  selectId: category => category._id,
});

export const categoriesInitalState: CategoriesState =
  categoriesAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: '',
    message: '',
  });

export const categoriesReducer = createReducer(
  categoriesInitalState,

  on(getCategories, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(getCategoriesError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(getCategoriesSuccess, (state, { categories }) =>
    categoriesAdapter.setAll(categories, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(createCategory, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(createCategoryError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(createCategorySuccess, (state, { category }) =>
    categoriesAdapter.addOne(category, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(updateCategory, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(updateCategoryError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(updateCategorySuccess, (state, { category }) =>
    categoriesAdapter.upsertOne(category, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(deleteCategory, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(deleteCategoryError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(deleteCategorySuccess, (state, { category }) =>
    categoriesAdapter.removeOne(category._id, {
      ...state,
      loading: false,
      loaded: true,
    })
  )
);
