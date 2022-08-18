import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { OrdersApiService } from '../services/orders-api.service';
import {
  getOrders,
  getOrdersError,
  getOrdersSuccess,
  getOrdersByUserId,
  getOrdersByUserIdSuccess,
  getOrdersByUserIdError,
  createOrder,
  createOrderSuccess,
  createOrderError,
  addItemToCart,
  removeItemFromCart,
} from './orders.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';

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
        this.ordersApi.getOrdersByUserId(action.categoryId).pipe(
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
