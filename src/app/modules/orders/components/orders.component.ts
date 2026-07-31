import { Component, Input, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { OrderStatus } from '../interface/order';
import {
  cancelOrder,
  getOrders,
  getOrdersByUserId,
  updateOrderStatus,
} from '../store/orders.actions';
import {
  selectOrders,
  selectOrdersPage,
  selectOrdersTotalPages,
} from '../store/orders.selectors';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { OrderCardComponent } from './order-card.component';

@Component({
  selector: 'app-orders',
  template: `
    @if (orders().length > 0) {
    <div>
      @if (!isAdmin()) {
      <h2 class="title-2 mb-4">Mis Pedidos</h2>
      } @if (isAdmin()) {
      <h2 class="title-2 mb-4">Pedidos</h2>
      }
    </div>
    } @if (orders().length < 1) {
    <h2 class="title-2 mb-4">No has realizado ningún pedido aún</h2>
    }
    <div class="flex flex-col gap-4">
      @for (order of orders(); track order) {
      <app-order-card
        [order]="order"
        [isAdmin]="isAdmin()"
        (statusChangeEvent)="onStatusChange($event)"
        (cancelEvent)="onCancel($event)">
      </app-order-card>
      }
    </div>
    @if (!userId && totalPages() > 1) {
    <div class="mt-4 flex items-center justify-center gap-4">
      <button
        class="secondary-button"
        [disabled]="page() <= 1"
        (click)="goToPage(page() - 1)">
        Anterior
      </button>
      <span>Página {{ page() }} de {{ totalPages() }}</span>
      <button
        class="secondary-button"
        [disabled]="page() >= totalPages()"
        (click)="goToPage(page() + 1)">
        Siguiente
      </button>
    </div>
    }
  `,
  styles: [],
  imports: [OrderCardComponent],
})
export class OrdersComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  @Input() userId: string = '';

  orders = toSignal(this.store.select(selectOrders), { initialValue: [] });
  isAdmin = toSignal(this.store.select(selectIsAdmin), { initialValue: false });
  page = toSignal(this.store.select(selectOrdersPage), { initialValue: 1 });
  totalPages = toSignal(this.store.select(selectOrdersTotalPages), {
    initialValue: 1,
  });

  getOrders(page: number = 1) {
    if (!this.userId) {
      this.store.dispatch(getOrders({ page }));
    } else {
      this.store.dispatch(getOrdersByUserId({ userId: this.userId }));
    }
  }

  goToPage(page: number) {
    this.getOrders(page);
  }

  onStatusChange(event: { orderId: string; status: OrderStatus }) {
    this.store.dispatch(
      updateOrderStatus({
        statusUpdate: { orderId: event.orderId, status: event.status },
      })
    );
  }

  onCancel(orderId: string) {
    this.store.dispatch(cancelOrder({ orderId }));
  }

  ngOnInit() {
    this.getOrders();
  }
}
