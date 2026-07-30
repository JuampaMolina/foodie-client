import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateOrderCommand } from '../interface/createOrderCommand';
import { Order } from '../interface/order';
import { UpdateOrderStatusCommand } from '../interface/updateOrderStatusCommand';

const ordersApi = environment.apiBaseUri + '/orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ordersApi);
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(ordersApi + `/user/${userId}`);
  }

  createOrder(order: CreateOrderCommand): Observable<Order> {
    return this.http.post<Order>(ordersApi, order);
  }

  updateOrderStatus(statusUpdate: UpdateOrderStatusCommand): Observable<Order> {
    const { orderId, status } = statusUpdate;
    return this.http.put<Order>(ordersApi + `/${orderId}/status`, { status });
  }
}
