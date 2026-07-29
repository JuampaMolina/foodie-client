import { Category } from '../interface/category';
import {
  createCategorySuccess,
  deleteCategorySuccess,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  updateCategorySuccess,
} from './categories.actions';
import {
  categoriesAdapter,
  categoriesInitalState,
  categoriesReducer,
} from './categories.reducer';

const { selectAll } = categoriesAdapter.getSelectors();

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
    expect(selectAll(state)).toEqual([category]);
    expect(state.loaded).toBeTrue();
  });

  it('should append the category on createCategorySuccess', () => {
    const newCategory: Category = { _id: '2', name: 'Postres' };
    const seeded = categoriesAdapter.setAll([category], categoriesInitalState);
    const state = categoriesReducer(
      seeded,
      createCategorySuccess({ category: newCategory })
    );
    expect(selectAll(state)).toEqual([category, newCategory]);
  });

  it('should replace the matching category on updateCategorySuccess', () => {
    const updated: Category = { _id: '1', name: 'Bebidas frías' };
    const seeded = categoriesAdapter.setAll([category], categoriesInitalState);
    const state = categoriesReducer(
      seeded,
      updateCategorySuccess({ category: updated })
    );
    expect(selectAll(state)).toEqual([updated]);
  });

  it('should remove the matching category on deleteCategorySuccess', () => {
    const seeded = categoriesAdapter.setAll([category], categoriesInitalState);
    const state = categoriesReducer(
      seeded,
      deleteCategorySuccess({ category })
    );
    expect(selectAll(state)).toEqual([]);
  });
});
