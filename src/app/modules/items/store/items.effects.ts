import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { OfflineCacheService } from 'src/app/shared/offline-cache.service';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';
import {
  createItem,
  createItemError,
  createItemSuccess,
  deleteItem,
  deleteItemError,
  deleteItemSuccess,
  getItems,
  getItemsByCategoryId,
  getItemsByCategoryIdError,
  getItemsByCategoryIdSuccess,
  getItemsError,
  getItemsSuccess,
  updateItem,
  updateItemError,
  updateItemSuccess,
} from './items.actions';

const OFFLINE_CACHE_KEY = 'items';

@Injectable()
export class ItemsEffects {
  private itemsApi = inject(ItemsApiService);
  private actions$ = inject(Actions);
  private offlineCache = inject(OfflineCacheService);

  getItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getItems),
      mergeMap(() =>
        this.itemsApi.getItems().pipe(
          map(items => {
            this.offlineCache.write(OFFLINE_CACHE_KEY, items);
            return getItemsSuccess({ items });
          }),
          catchError(error => {
            // Sin red: si hay un menú visto antes, mejor mostrar eso que
            // una sección vacía. Sólo se cachea el listado completo (no el
            // filtrado por categoría), que es el que pinta la home.
            const cached = this.offlineCache.read<Item[]>(OFFLINE_CACHE_KEY);
            return of(
              cached
                ? getItemsSuccess({ items: cached })
                : getItemsError({ error })
            );
          })
        )
      )
    )
  );

  getItemsByCategoryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getItemsByCategoryId),
      mergeMap(action =>
        this.itemsApi.getItemsByCategoryId(action.categoryId).pipe(
          map(items => getItemsByCategoryIdSuccess({ items })),
          catchError(error => of(getItemsByCategoryIdError({ error })))
        )
      )
    )
  );

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createItem),
      mergeMap(action =>
        this.itemsApi.createItem(action.item).pipe(
          map(item => createItemSuccess({ item })),
          catchError(error => of(createItemError({ error })))
        )
      )
    )
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateItem),
      mergeMap(action =>
        this.itemsApi.updateItem(action.itemUpdate).pipe(
          map(item => updateItemSuccess({ item })),
          catchError(error => of(updateItemError({ error })))
        )
      )
    )
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteItem),
      mergeMap(action =>
        this.itemsApi.deleteItem(action.itemId).pipe(
          map(item => deleteItemSuccess({ item })),
          catchError(error => of(deleteItemError({ error })))
        )
      )
    )
  );
}
