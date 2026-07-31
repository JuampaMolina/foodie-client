import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { MetricsApiService } from '../services/metrics-api.service';
import {
  getSalesByDay,
  getSalesByDayError,
  getSalesByDaySuccess,
  getTopItems,
  getTopItemsError,
  getTopItemsSuccess,
} from './metrics.actions';

@Injectable()
export class MetricsEffects {
  private metricsApi = inject(MetricsApiService);
  private actions$ = inject(Actions);

  getSalesByDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSalesByDay),
      mergeMap(({ days }) =>
        this.metricsApi.getSalesByDay(days).pipe(
          map(salesByDay => getSalesByDaySuccess({ salesByDay })),
          catchError(error => of(getSalesByDayError({ error })))
        )
      )
    )
  );

  getTopItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTopItems),
      mergeMap(({ limit }) =>
        this.metricsApi.getTopItems(limit).pipe(
          map(topItems => getTopItemsSuccess({ topItems })),
          catchError(error => of(getTopItemsError({ error })))
        )
      )
    )
  );
}
