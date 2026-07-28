import { Category } from '../interface/category';
import {
  createCategorySuccess,
  deleteCategorySuccess,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  updateCategorySuccess,
} from './categories.actions';
import { categoriesInitalState, categoriesReducer } from './categories.reducer';

describe('categoriesReducer', () => {
  const category: Category = { _id: '1', name: 'Bebidas' };

  it('should return the initial state for an unknown action', () => {
    const state = categoriesReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(categoriesInitalState);
  });

  it('should set loading on getCategories', () => {
    const state = categoriesReducer(categoriesInitalState, getCategories());
    expect(state.loading).toBeTrue();
    expect(state.loaded).toBeFalse();
  });

  it('should set the error message on getCategoriesError', () => {
    const state = categoriesReducer(
      categoriesInitalState,
      getCategoriesError({ error: { message: 'boom' } })
    );
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('boom');
  });

  it('should populate categories on getCategoriesSuccess', () => {
    const state = categoriesReducer(
      categoriesInitalState,
      getCategoriesSuccess({ categories: [category] })
    );
    expect(state.categories).toEqual([category]);
    expect(state.loaded).toBeTrue();
  });

  it('should append the category on createCategorySuccess', () => {
    const newCategory: Category = { _id: '2', name: 'Postres' };
    const state = categoriesReducer(
      { ...categoriesInitalState, categories: [category] },
      createCategorySuccess({ category: newCategory })
    );
    expect(state.categories).toEqual([category, newCategory]);
  });

  it('should replace the matching category on updateCategorySuccess', () => {
    const updated: Category = { _id: '1', name: 'Bebidas frías' };
    const state = categoriesReducer(
      { ...categoriesInitalState, categories: [category] },
      updateCategorySuccess({ category: updated })
    );
    expect(state.categories).toEqual([updated]);
  });

  it('should remove the matching category on deleteCategorySuccess', () => {
    const state = categoriesReducer(
      { ...categoriesInitalState, categories: [category] },
      deleteCategorySuccess({ category })
    );
    expect(state.categories).toEqual([]);
  });
});
