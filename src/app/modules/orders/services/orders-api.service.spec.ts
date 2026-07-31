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

  it('should GET a page of orders', () => {
    const page = {
      items: [order],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };
    service.getOrders(1, 10).subscribe(result => {
      expect(result).toEqual(page);
    });

    const req = httpMock.expectOne(req => req.url === ordersApi);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(page);
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
      items: [{ item: 'item-1', quantity: 2 }],
      address: 'Calle Falsa 123',
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

  it('should PUT to cancel an order', () => {
    const cancelled: Order = { ...order, status: 'cancelled' };
    service.cancelOrder('1').subscribe(result => {
      expect(result).toEqual(cancelled);
    });

    const req = httpMock.expectOne(ordersApi + '/1/cancel');
    expect(req.request.method).toBe('PUT');
    req.flush(cancelled);
  });
});
