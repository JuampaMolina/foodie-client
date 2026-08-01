import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Order } from '../interface/order';
import { OrdersApiService } from '../services/orders-api.service';
import {
  cancelOrder,
  cancelOrderError,
  cancelOrderSuccess,
  createOrder,
  createOrderError,
  createOrderSuccess,
} from './orders.actions';
import { OrdersEffects } from './orders.effects';

describe('OrdersEffects', () => {
  let actions$: Observable<any>;
  let effects: OrdersEffects;
  let ordersApi: jasmine.SpyObj<OrdersApiService>;
  let router: jasmine.SpyObj<Router>;

  const order: Order = {
    _id: '1',
    totalPrice: 12,
    date: new Date('2024-01-01'),
    status: 'pending',
  };

  beforeEach(() => {
    ordersApi = jasmine.createSpyObj('OrdersApiService', [
      'createOrder',
      'cancelOrder',
    ]);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrdersApiService, useValue: ordersApi },
        { provide: Router, useValue: router },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
  });

  it('should dispatch createOrderSuccess when the API call succeeds', done => {
    ordersApi.createOrder.and.returnValue(of(order));
    actions$ = of(createOrder({ order: {} as any }));

    effects.createOrder$.subscribe(action => {
      expect(action).toEqual(createOrderSuccess({ order }));
      done();
    });
  });

  it('should dispatch createOrderError when the API call fails', done => {
    const error = { message: 'boom' };
    ordersApi.createOrder.and.returnValue(throwError(() => error));
    actions$ = of(createOrder({ order: {} as any }));

    effects.createOrder$.subscribe(action => {
      expect(action).toEqual(createOrderError({ error }));
      done();
    });
  });

  it('should dispatch cancelOrderSuccess when the API call succeeds', done => {
    ordersApi.cancelOrder.and.returnValue(of(order));
    actions$ = of(cancelOrder({ orderId: '1' }));

    effects.cancelOrder$.subscribe(action => {
      expect(action).toEqual(cancelOrderSuccess({ order }));
      done();
    });
  });

  it('should dispatch cancelOrderError when the API call fails', done => {
    const error = { message: 'boom' };
    ordersApi.cancelOrder.and.returnValue(throwError(() => error));
    actions$ = of(cancelOrder({ orderId: '1' }));

    effects.cancelOrder$.subscribe(action => {
      expect(action).toEqual(cancelOrderError({ error }));
      done();
    });
  });

  it('navigates home after a successful checkout', done => {
    actions$ = of(createOrderSuccess({ order }));

    effects.navigateHomeAfterCreateOrder$.subscribe(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });
});
