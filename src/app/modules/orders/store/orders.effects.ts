import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { OrdersApiService } from '../services/orders-api.service';
import {
  cancelOrder,
  cancelOrderError,
  cancelOrderSuccess,
  createOrder,
  createOrderError,
  createOrderSuccess,
  getOrders,
  getOrdersByUserId,
  getOrdersByUserIdError,
  getOrdersByUserIdSuccess,
  getOrdersError,
  getOrdersSuccess,
  updateOrderStatus,
  updateOrderStatusError,
  updateOrderStatusSuccess,
} from './orders.actions';

const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class OrdersEffects {
  private ordersApi = inject(OrdersApiService);
  private actions$ = inject(Actions);
  private router = inject(Router);

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrders),
      mergeMap(({ page = 1, limit = DEFAULT_PAGE_SIZE }) =>
        this.ordersApi.getOrders(page, limit).pipe(
          map(({ items, page, total, totalPages }) =>
            getOrdersSuccess({ orders: items, page, total, totalPages })
          ),
          catchError(error => of(getOrdersError({ error })))
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
          catchError(error => of(getOrdersByUserIdError({ error })))
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
          catchError(error => of(createOrderError({ error })))
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOrderStatus),
      mergeMap(action =>
        this.ordersApi.updateOrderStatus(action.statusUpdate).pipe(
          map(order => updateOrderStatusSuccess({ order })),
          catchError(error => of(updateOrderStatusError({ error })))
        )
      )
    )
  );

  cancelOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelOrder),
      mergeMap(action =>
        this.ordersApi.cancelOrder(action.orderId).pipe(
          map(order => cancelOrderSuccess({ order })),
          catchError(error => of(cancelOrderError({ error })))
        )
      )
    )
  );

  navigateHomeAfterCreateOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        tap(() => this.router.navigateByUrl('/'))
      ),
    { dispatch: false }
  );
}
