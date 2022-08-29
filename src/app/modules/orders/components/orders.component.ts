import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducers';
import { Order } from '../interface/order';
import { getOrders, getOrdersByUserId } from '../store/orders.actions';
import { selectOrders } from '../store/orders.selectors';

@Component({
  selector: 'app-orders',
  template: `
    <h2 *ngIf="orders.length > 0" class="title-2 mb-4">Mis Pedidos</h2>
    <div class="flex flex-col gap-4">
      <app-order-card *ngFor="let order of orders" [order]="order">
      </app-order-card>
    </div>
  `,
  styles: [],
})
export class OrdersComponent implements OnInit, OnDestroy {
  @Input() userId: string = '';
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
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
