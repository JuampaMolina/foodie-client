import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ItemsApiService } from '../services/items-api.service';
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

@Injectable()
export class ItemsEffects {
  private itemsApi = inject(ItemsApiService);
  private actions$ = inject(Actions);

  getItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getItems),
      mergeMap(() =>
        this.itemsApi.getItems().pipe(
          map(items => getItemsSuccess({ items })),
          catchError(error => of(getItemsError({ error })))
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
