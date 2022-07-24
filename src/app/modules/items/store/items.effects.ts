import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ItemsApiService } from '../services/items-api.service';
import { getItems, getItemsError, getItemsSuccess } from './items.actions';


@Injectable()
export class ItemsEffects {

  constructor(
    private itemsApi: ItemsApiService,
    private actions$: Actions
  ) { }

  getItems$ = createEffect(() => this.actions$.pipe(
    ofType(getItems),
    tap(() => console.log()),
    mergeMap(() => this.itemsApi.getItems()
      .pipe(
        map((items) => (getItemsSuccess({ items }))),
        catchError((error) => of(getItemsError(error)))
      ))
  ))

  // getItems$ = createEffect(
  //   () => this.actions$.pipe(
  //     ofType(getItems),
  //     mergeMap(() =>
  //       this.itemsApi.getItems
  //         .pipe(
  //           map(data => getItemsSuccess({ data })),
  //           catchError(error => of(getItemsError({ error }))))
  //     ),
  //   );
  // );

  // todo: por qué no puedo hacer un pipe en getItems
}
