import { createReducer, on } from '@ngrx/store';
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

export const categoriesInitalState: CategoriesState = {
  categories: [],
  loading: false,
  loaded: false,
  error: '',
  message: '',
};

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

  on(getCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    loaded: true,
    categories: categories,
  })),

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

  on(createCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    loaded: true,
    categories: [...state.categories, category],
  })),

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

  on(updateCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    loaded: true,
    categories: state.categories.map(i =>
      i._id === category._id ? category : i
    ),
  })),

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

  on(deleteCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    loaded: true,
    categories: state.categories.filter(i => i._id !== category._id),
  }))
);
