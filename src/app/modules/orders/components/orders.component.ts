import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducers';
import { Order } from '../interface/order';
import { getOrders, getOrdersByUserId } from '../store/orders.actions';
import { selectOrders } from '../store/orders.selectors';
import { User } from '../../users/interface/user';

@Component({
  selector: 'app-orders',
  template: ` <div *ngIf="user" class="mb-4">
      <span class=" text-xl font-semibold">
        Mostrando pedidos de {{ user }}
      </span>
      <i
        (click)="getOrders()"
        class="fa-solid fa-square-xmark cursor-pointer"></i>
    </div>
    <div class="flex flex-col gap-4">
      <app-order-card
        *ngFor="let order of orders"
        [order]="order"
        (filterUser)="getOrdersByUserId($event)">
      </app-order-card>
    </div>`,
  styles: [],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  user: string = '';

  private onDestroy = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  getOrders() {
    this.store.dispatch(getOrders());
    this.user = '';
  }

  getOrdersByUserId(user: User) {
    this.store.dispatch(getOrdersByUserId({ userId: user._id }));
    this.user = user.name;
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
