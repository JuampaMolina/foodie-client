import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducers';
import { Order } from '../interface/order';
import { getOrders, getOrdersByUserId } from '../store/orders.actions';
import { selectOrders } from '../store/orders.selectors';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { OrderCardComponent } from './order-card.component';

@Component({
  selector: 'app-orders',
  template: `
    @if (orders.length > 0) {
    <div>
      @if (!isAdmin) {
      <h2 class="title-2 mb-4">Mis Pedidos</h2>
      } @if (isAdmin) {
      <h2 class="title-2 mb-4">Pedidos</h2>
      }
    </div>
    } @if (orders.length < 1) {
    <h2 class="title-2 mb-4">No has realizado ningún pedido aún</h2>
    }
    <div class="flex flex-col gap-4">
      @for (order of orders; track order) {
      <app-order-card [order]="order"> </app-order-card>
      }
    </div>
  `,
  styles: [],
  imports: [OrderCardComponent],
})
export class OrdersComponent implements OnInit, OnDestroy {
  @Input() userId: string = '';
  isAdmin: boolean = false;
  orders: Order[] = [];

  private onDestroy = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  getOrders() {
    if (!this.userId) {
      this.store.dispatch(getOrders());
    } else {
      this.store.dispatch(getOrdersByUserId({ userId: this.userId }));
    }
  }

  ngOnInit() {
    this.store
      .select(selectOrders)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(orders => (this.orders = orders));

    this.store
      .select(selectIsAdmin)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isAdmin => (this.isAdmin = isAdmin));
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
