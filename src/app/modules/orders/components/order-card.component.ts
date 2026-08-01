import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order, OrderStatus } from '../interface/order';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { DatePipe } from '@angular/common';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

// Los contrastes de estas combinaciones están medidos sobre la app real
// (7,3:1 el peor en oscuro, por encima de AAA). Si se tocan las opacidades o
// los tonos, conviene volver a medirlos: un texto claro sobre el fondo claro
// del modo claro pasa desapercibido leyendo sólo el código.
const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending:
    'bg-neutral-200 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-300',
  preparing:
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  delivered:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
};

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'preparing', 'delivered'];

@Component({
  selector: 'app-order-card',
  template: `
    @if (order) {
    <div
      (click)="showContent = true"
      class="surface-card grid cursor-pointer grid-cols-4 items-center gap-3 p-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-5">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Fecha
        </p>
        <p class="font-semibold text-neutral-900 dark:text-white">
          {{ order.date | date: 'dd/MM/yyyy' }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Usuario
        </p>
        <p class="font-semibold text-neutral-900 dark:text-white">
          {{ order.user?.name }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Estado
        </p>
        <span
          class="rounded-full px-2 py-0.5 text-xs font-semibold"
          [class]="statusClass">
          {{ statusLabel }}
        </span>
      </div>
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Total
        </p>
        <p class="font-semibold text-brand-700 dark:text-brand-400">
          {{ order.totalPrice }} EUR
        </p>
      </div>
      <div class="hidden items-center justify-center sm:flex">
        <span class="secondary-button px-3 py-1.5 text-sm">Ver detalles</span>
      </div>
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
          <p class="detail-label">Id</p>
          <span>{{ order._id }}</span>
        </div>
        <div>
          <p class="detail-label">Fecha</p>
          <span>{{ order.date | date: 'dd/MM/yyyy hh:mm:ss' }}</span>
        </div>
        <div>
          <p class="detail-label">Usuario</p>
          <span>{{ order.user?.name }}</span>
        </div>
        @if (order.address) {
        <div>
          <p class="detail-label">Dirección de entrega</p>
          <span>{{ order.address }}</span>
        </div>
        }
        <div>
          <p class="detail-label">Estado</p>
          <span
            class="rounded-full px-2 py-1 text-xs font-semibold"
            [class]="statusClass">
            {{ statusLabel }}
          </span>
        </div>
        <div>
          <p class="detail-label">Contenido</p>
          <div class="divide-y divide-neutral-200 dark:divide-neutral-800">
            @for (orderItem of order.items; track orderItem.item._id) {
            <div class="flex justify-between py-1.5">
              <span
                >{{ orderItem.item.name }}
                <span class="text-neutral-400"
                  >x {{ orderItem.quantity }}</span
                ></span
              >
              <span>{{ orderItem.item.price * orderItem.quantity }} EUR</span>
            </div>
            }
          </div>
          <div class="flex justify-between pt-2 font-semibold">
            <span>Total</span>
            <span class="text-brand-700 dark:text-brand-400"
              >{{ order.totalPrice }} EUR</span
            >
          </div>
        </div>
        @if (isAdmin) {
        <div>
          <label class="form-label" for="status">Cambiar estado</label>
          <select
            id="status"
            class="select-background form-input w-full cursor-pointer"
            (change)="onStatusChange($event)">
            @for (option of statusOptions; track option) {
            <option [value]="option" [selected]="option === status">
              {{ statusLabels[option] }}
            </option>
            }
          </select>
        </div>
        } @if (!isAdmin && status === 'pending') {
        <button (click)="onCancel()" class="secondary-button w-full">
          Cancelar pedido
        </button>
        }
      </div>
      }
    </p-dialog>
  `,
  styles: [
    `
      .detail-label {
        @apply text-xs font-semibold uppercase tracking-wide text-neutral-400;
      }
    `,
  ],
  imports: [Bind, Dialog, DatePipe],
})
export class OrderCardComponent {
  @Input() order?: Order;
  @Input() isAdmin: boolean = false;
  @Output() statusChangeEvent = new EventEmitter<{
    orderId: string;
    status: OrderStatus;
  }>();
  @Output() cancelEvent = new EventEmitter<string>();

  showContent: boolean = false;

  constructor() {}

  readonly statusLabels = STATUS_LABELS;
  readonly statusOptions = STATUS_OPTIONS;

  get status(): OrderStatus {
    return this.order?.status ?? 'pending';
  }

  get statusLabel(): string {
    return STATUS_LABELS[this.status];
  }

  get statusClass(): string {
    return STATUS_CLASSES[this.status];
  }

  onStatusChange(event: Event) {
    const status = (event.target as HTMLSelectElement).value as OrderStatus;
    if (this.order && status !== this.status) {
      this.statusChangeEvent.emit({ orderId: this.order._id, status });
    }
  }

  onCancel() {
    if (this.order) {
      this.cancelEvent.emit(this.order._id);
    }
  }
}
