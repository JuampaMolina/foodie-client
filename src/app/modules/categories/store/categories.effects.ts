import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CategoriesApiService } from '../services/categories-api.service';
import {
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  createCategory,
  createCategorySuccess,
  createCategoryError,
  updateCategory,
  updateCategorySuccess,
  updateCategoryError,
  deleteCategory,
  deleteCategorySuccess,
  deleteCategoryError,
} from './categories.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';

@Injectable()
export class CategoriesEffects {
  constructor(
    private categoriesApi: CategoriesApiService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCategories, createCategorySuccess),
      mergeMap(() =>
        this.categoriesApi.getCategories().pipe(
          map(categories => getCategoriesSuccess({ categories })),
          catchError(error => of(getCategoriesError(error)))
        )
      )
    )
  );

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCategory),
      mergeMap(action =>
        this.categoriesApi.createCategory(action.category).pipe(
          map(category => createCategorySuccess({ category })),
          catchError(error => of(createCategoryError(error)))
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCategory),
      mergeMap(action =>
        this.categoriesApi.updateCategory(action.categoryUpdate).pipe(
          map(category => updateCategorySuccess({ category })),
          catchError(error => of(updateCategoryError(error)))
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCategory),
      mergeMap(action =>
        this.categoriesApi.deleteCategory(action.categoryId).pipe(
          map(category => deleteCategorySuccess({ category })),
          catchError(error => of(deleteCategoryError(error)))
        )
      )
    )
  );
}
