import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Order } from '../interface/order';
import { Observable } from 'rxjs';
import { CreateOrderCommand } from '../interface/createOrderCommand';

const ordersApi = environment.apiBaseUri + '/orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ordersApi);
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(ordersApi + `/user/${userId}`);
  }

  createOrder(order: CreateOrderCommand): Observable<Order> {
    return this.http.post<Order>(ordersApi, order);
  }
}
