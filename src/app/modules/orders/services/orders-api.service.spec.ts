import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Order } from '../interface/order';
import { OrdersApiService } from './orders-api.service';

describe('OrdersApiService', () => {
  let service: OrdersApiService;
  let httpMock: HttpTestingController;

  const ordersApi = environment.apiBaseUri + '/orders';
  const order: Order = {
    _id: '1',
    totalPrice: 20,
    date: new Date('2026-01-01'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OrdersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET all orders', () => {
    service.getOrders().subscribe(orders => {
      expect(orders).toEqual([order]);
    });

    const req = httpMock.expectOne(ordersApi);
    expect(req.request.method).toBe('GET');
    req.flush([order]);
  });

  it('should GET orders by user id', () => {
    service.getOrdersByUserId('user-1').subscribe(orders => {
      expect(orders).toEqual([order]);
    });

    const req = httpMock.expectOne(ordersApi + '/user/user-1');
    expect(req.request.method).toBe('GET');
    req.flush([order]);
  });

  it('should POST a new order', () => {
    const newOrder = {
      totalPrice: 20,
      date: new Date('2026-01-01'),
      items: ['item-1'],
    };
    service.createOrder(newOrder).subscribe(result => {
      expect(result).toEqual(order);
    });

    const req = httpMock.expectOne(ordersApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);
    req.flush(order);
  });

  it('should PUT the new status of an order', () => {
    const updated: Order = { ...order, status: 'preparing' };
    service
      .updateOrderStatus({ orderId: '1', status: 'preparing' })
      .subscribe(result => {
        expect(result).toEqual(updated);
      });

    const req = httpMock.expectOne(ordersApi + '/1/status');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'preparing' });
    req.flush(updated);
  });
});
