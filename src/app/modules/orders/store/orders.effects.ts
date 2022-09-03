import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AppState } from '../../../store/app.reducers';
import { OrdersApiService } from '../services/orders-api.service';
import {
  createOrder,
  createOrderError,
  createOrderSuccess,
  getOrders,
  getOrdersByUserId,
  getOrdersByUserIdError,
  getOrdersByUserIdSuccess,
  getOrdersError,
  getOrdersSuccess,
} from './orders.actions';

@Injectable()
export class OrdersEffects {
  constructor(
    private ordersApi: OrdersApiService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrders),
      mergeMap(() =>
        this.ordersApi.getOrders().pipe(
          map(orders => getOrdersSuccess({ orders })),
          catchError(error => of(getOrdersError(error)))
        )
      )
    )
  );

  getOrdersByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrdersByUserId),
      mergeMap(action =>
        this.ordersApi.getOrdersByUserId(action.userId).pipe(
          map(orders => getOrdersByUserIdSuccess({ orders })),
          catchError(error => of(getOrdersByUserIdError(error)))
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrder),
      mergeMap(action =>
        this.ordersApi.createOrder(action.order).pipe(
          map(order => createOrderSuccess({ order })),
          catchError(error => of(createOrderError(error)))
        )
      )
    )
  );
}
