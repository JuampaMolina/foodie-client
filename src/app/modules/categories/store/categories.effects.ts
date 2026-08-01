import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { OfflineCacheService } from 'src/app/shared/offline-cache.service';
import { CategoriesApiService } from '../services/categories-api.service';
import { Category } from '../interface/category';
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

const OFFLINE_CACHE_KEY = 'categories';

@Injectable()
export class CategoriesEffects {
  private categoriesApi = inject(CategoriesApiService);
  private actions$ = inject(Actions);
  private offlineCache = inject(OfflineCacheService);

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCategories),
      mergeMap(() =>
        this.categoriesApi.getCategories().pipe(
          map(categories => {
            this.offlineCache.write(OFFLINE_CACHE_KEY, categories);
            return getCategoriesSuccess({ categories });
          }),
          catchError(error => {
            // Sin red: si hay un menú visto antes, mejor mostrar eso que
            // una sección vacía. Se guarda sólo la lista completa (no las
            // que quedan filtradas por categoría), que es la que pinta la
            // home.
            const cached =
              this.offlineCache.read<Category[]>(OFFLINE_CACHE_KEY);
            return of(
              cached
                ? getCategoriesSuccess({ categories: cached })
                : getCategoriesError({ error })
            );
          })
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
          catchError(error => of(createCategoryError({ error })))
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
          catchError(error => of(updateCategoryError({ error })))
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
          catchError(error => of(deleteCategoryError({ error })))
        )
      )
    )
  );
}
