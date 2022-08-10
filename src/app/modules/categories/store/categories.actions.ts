import { createAction, props } from '@ngrx/store';
import { Category } from '../interface/category';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';

export const getCategories = createAction('[Categories] getCategories');
export const getCategoriesError = createAction(
  '[Categories] getCategoriesError',
  props<{ error: any }>()
);
export const getCategoriesSuccess = createAction(
  '[Categories] getCategoriesSuccess',
  props<{ categories: Category[] }>()
);

export const createCategory = createAction(
  '[Categories] createCategory',
  props<{ category: CreateCategoryCommand }>()
);
export const createCategoryError = createAction(
  '[Categories] createCategoryError',
  props<{ error: any }>()
);
export const createCategorySuccess = createAction(
  '[Categories] createCategorySuccess',
  props<{ category: Category }>()
);

export const updateCategory = createAction(
  '[Categories] updateCategory',
  props<{ categoryUpdate: UpdateCategoryCommand }>()
);
export const updateCategoryError = createAction(
  '[Categories] updateCategoryError',
  props<{ error: any }>()
);
export const updateCategorySuccess = createAction(
  '[Categories] updateCategorySuccess',
  props<{ category: Category }>()
);

export const deleteCategory = createAction(
  '[Categories] deleteCategory',
  props<{ categoryId: string }>()
);
export const deleteCategoryError = createAction(
  '[Categories] deleteCategoryError',
  props<{ error: any }>()
);
export const deleteCategorySuccess = createAction(
  '[Categories] deleteCategorySuccess',
  props<{ category: Category }>()
);
