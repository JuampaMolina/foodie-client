import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order, OrderStatus } from '../interface/order';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { DatePipe } from '@angular/common';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  delivered: 'Entregado',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-slate-300 text-slate-800',
  preparing: 'bg-amber-300 text-amber-900',
  delivered: 'bg-emerald-300 text-emerald-900',
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'preparing',
  preparing: 'delivered',
};

@Component({
  selector: 'app-order-card',
  template: `
    @if (order) {
    <div
      (click)="showContent = true"
      class="secondary-button grid grid-cols-4 sm:grid-cols-5">
      <span class="">Fecha</span>
      <span class="border-l-2 border-l-slate-800">Usuario</span>
      <span class="border-l-2 border-l-slate-800">Estado</span>
      <span class="border-l-2 border-l-slate-800">Total</span>
      <span
        class="row-span-2 hidden h-12 items-center justify-center border-l-2 border-l-slate-800 font-semibold sm:flex"
        >Ver Detalles</span
      >
      <span class="font-semibold">{{ order.date | date: 'dd/MM/yyyy' }}</span>
      <span class="border-l-2 border-l-slate-800 font-semibold">{{
        order.user?.name
      }}</span>
      <span class="border-l-2 border-l-slate-800 font-semibold">
        <span
          class="rounded-full px-2 py-1 text-xs font-semibold"
          [class]="statusClass">
          {{ statusLabel }}
        </span>
      </span>
      <span class="border-l-2 border-l-slate-800 font-semibold"
        >{{ order.totalPrice }} EUR</span
      >
    </div>
    }

    <p-dialog
      header="Detalles del pedido"
      [(visible)]="showContent"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      @if (order) {
      <div class="space-y-4">
        <div>
          <p class="text-lg font-semibold">Id</p>
          <span>{{ order._id }}</span>
        </div>
        <div>
          <p class="text-lg font-semibold">Fecha</p>
          <span>{{ order.date | date: 'dd/MM/yyyy hh:mm:ss' }}</span>
        </div>
        <div>
          <p class="text-lg font-semibold">Usuario</p>
          <span>{{ order.user?.name }}</span>
        </div>
        <div>
          <p class="text-lg font-semibold">Estado</p>
          <span
            class="rounded-full px-2 py-1 text-xs font-semibold"
            [class]="statusClass">
            {{ statusLabel }}
          </span>
        </div>
        <div>
          <p class="text-lg font-semibold">Contenido</p>
          @for (item of order.items; track item) {
          <div class="space-x-2">
            <span>{{ item.name }}</span>
            <span>x {{ getQuantity(item._id) }}</span>
            <span class="float-right"
              >{{ item.price * getQuantity(item._id) }} EUR</span
            >
          </div>
          }
          <span class="float-right font-medium"
            >Total {{ order.totalPrice }} EUR</span
          >
        </div>
        @if (isAdmin && nextStatus) {
        <button (click)="advanceStatus()" class="primary-button w-full">
          Marcar como {{ nextStatusLabel }}
        </button>
        }
      </div>
      }
    </p-dialog>
  `,
  styles: [],
  imports: [Bind, Dialog, DatePipe],
})
export class OrderCardComponent {
  @Input() order?: Order;
  @Input() isAdmin: boolean = false;
  @Output() statusChangeEvent = new EventEmitter<{
    orderId: string;
    status: OrderStatus;
  }>();

  showContent: boolean = false;

  constructor() {}

  get status(): OrderStatus {
    return this.order?.status ?? 'pending';
  }

  get statusLabel(): string {
    return STATUS_LABELS[this.status];
  }

  get statusClass(): string {
    return STATUS_CLASSES[this.status];
  }

  get nextStatus(): OrderStatus | undefined {
    return NEXT_STATUS[this.status];
  }

  get nextStatusLabel(): string {
    return this.nextStatus ? STATUS_LABELS[this.nextStatus] : '';
  }

  getQuantity(itemId: string): number {
    return this.order?.items!.filter(item => item._id === itemId).length!;
  }

  advanceStatus() {
    const next = this.nextStatus;
    if (next && this.order) {
      this.statusChangeEvent.emit({ orderId: this.order._id, status: next });
    }
  }
}
