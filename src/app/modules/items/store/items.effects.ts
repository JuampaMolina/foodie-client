import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ItemsApiService } from '../services/items-api.service';
import { getItems, getItemsError, getItemsSuccess, createItem, createItemSuccess, createItemError } from './items.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';


@Injectable()
export class ItemsEffects {

  constructor(
    private itemsApi: ItemsApiService,
    private actions$: Actions,
    private store: Store<AppState>
  ) { }

  getItems$ = createEffect(() => this.actions$.pipe(
    ofType(getItems, createItemSuccess),
    mergeMap(() => this.itemsApi.getItems()
      .pipe(
        map((items) => (getItemsSuccess({ items }))),
        catchError((error) => of(getItemsError(error)))
      ))
  ))

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(createItem),
    mergeMap((action) => this.itemsApi.createItem(action.item)
      .pipe(
        map((item) => (createItemSuccess({ item }))),
        catchError((error) => of(createItemError(error)))
      ))
  ))
}
