import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../users/interface/user';
import { Order } from '../interface/order';

@Component({
  selector: 'app-order-card',
  template: `
    <div
      *ngIf="order"
      class="secondary-button grid grid-cols-5 divide-slate-800">
      <span class="">Id</span>
      <span class="border-l">Fecha</span>
      <span class="border-l">Usuario</span>
      <span class="border-l">Total</span>

      <span
        (click)="showContent = true"
        class="row-span-2 border-l font-semibold"
        >Ver Detalles</span
      >

      <span class="font-semibold">{{ order._id }}</span>
      <span class="border-l font-semibold">{{ order.date }}</span>
      <span
        (click)="filterUser.emit(order.user)"
        class="border-l font-semibold"
        >{{ order.user?.name }}</span
      >
      <span class="border-l font-semibold">{{ order.totalPrice }} EUR</span>
    </div>

    <p-dialog
      header="Detalles del pedido"
      [(visible)]="showContent"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      <div class="space-y-4" *ngIf="order">
        <div>
          <h2 class="text-lg font-semibold">Id</h2>
          <span>{{ order._id }}</span>
        </div>

        <div>
          <h2 class="text-lg font-semibold">Fecha</h2>
          <span>{{ order.date }}</span>
        </div>

        <div>
          <h2 class="text-lg font-semibold">Usuario</h2>
          <span>{{ order.user?.name }}</span>
        </div>

        <div>
          <h2 class="text-lg font-semibold">Contenido</h2>
          <div class="space-x-2" *ngFor="let item of order.items">
            <span>{{ item.name }}</span>
            <span>x {{ getQuantity(item._id) }}</span>
            <span class="float-right"
              >{{ item.price * getQuantity(item._id) }} EUR</span
            >
          </div>
          <span class="float-right font-medium"
            >Total {{ order.totalPrice }} EUR</span
          >
        </div>
      </div>
    </p-dialog>
  `,
  styles: [],
})
export class OrderCardComponent {
  @Input() order?: Order;
  @Output() filterUser = new EventEmitter<User>();

  showContent: boolean = false;

  constructor() {}

  getQuantity(itemId: string): number {
    return this.order?.items!.filter(item => item._id === itemId).length!;
  }
}