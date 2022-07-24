import { createAction, props } from '@ngrx/store';
import { Category } from '../interface/category';

export const getCategories = createAction('[Categories] getCategories');
export const getCategoriesError = createAction('[Categories] getCategoriesError', props<{ error: any }>());
export const getCategoriesSuccess = createAction('[Categories] getCategoriesSuccess', props<{ categories: Category[] }>());

export const createCategory = createAction('[Categories] createCategory', props<{ category: string }>());
export const createCategoryError = createAction('[Categories] createCategoryError', props<{ error: any }>());
export const createCategorySuccess = createAction('[Categories] createCategorySuccess', props<{ category: any }>());
