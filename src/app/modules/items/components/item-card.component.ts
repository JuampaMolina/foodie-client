import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../interface/item';

const DEFAULT_ITEM_IMAGE = 'assets/placeholder.svg';

export type ItemCardLayout = 'grid' | 'row';

@Component({
  selector: 'app-item-card',
  template: `
    @if (item) { @if (layout === 'row') {
    <div
      class="surface-card flex gap-4 p-3 transition duration-150 hover:shadow-md">
      <img
        [src]="item.category?.image || defaultImage"
        [alt]="item.name"
        class="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div class="flex grow flex-col justify-center overflow-hidden">
        <span class="truncate font-semibold text-neutral-900 dark:text-white">{{
          item.name
        }}</span>
        <span class="truncate text-sm text-neutral-500 dark:text-neutral-400">{{
          item.description
        }}</span>
        <span class="mt-1 flex items-center justify-between gap-2">
          <span
            class="font-mukta text-lg font-bold text-brand-700 dark:text-brand-400"
            >{{ item.price }} EUR</span
          >
          <span class="flex items-center gap-1.5">
            <button
              type="button"
              class="stepper-button"
              (click)="removeItem()"
              aria-label="Quitar una unidad">
              <i class="fa-solid fa-minus text-xs"></i>
            </button>
            <input
              type="number"
              min="0"
              class="form-input w-12 select-none px-1 py-1 text-center text-sm"
              [value]="quantity"
              (change)="onQuantityInput($event)"
              aria-label="Cantidad" />
            <button
              type="button"
              class="stepper-button"
              (click)="addItem()"
              aria-label="Añadir una unidad">
              <i class="fa-solid fa-plus text-xs"></i>
            </button>
            <button
              type="button"
              class="stepper-button ml-1 text-neutral-400 hover:text-red-600"
              (click)="removeItem(quantity)"
              aria-label="Quitar del carrito">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </span>
        </span>
      </div>
    </div>
    } @else {
    <div
      class="surface-card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div
        class="relative flex aspect-[5/4] items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900">
        <img
          [src]="item.category?.image || defaultImage"
          [alt]="item.name"
          class="h-4/5 w-4/5 rounded-full object-contain transition duration-300 group-hover:scale-105" />
        @if (item.category?.name) {
        <span
          class="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 backdrop-blur dark:bg-black/50 dark:text-neutral-300"
          >{{ item.category?.name }}</span
        >
        } @if (quantity > 0 && !isAdmin) {
        <span
          class="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white shadow-sm"
          >{{ quantity }}</span
        >
        }
      </div>
      <div class="flex grow flex-col gap-1 p-4">
        <span class="font-semibold text-neutral-900 dark:text-white">{{
          item.name
        }}</span>
        <span
          class="line-clamp-2 grow text-sm text-neutral-500 dark:text-neutral-400"
          >{{ item.description }}</span
        >
        <span class="flex items-center justify-between gap-2 pt-2">
          <span
            class="font-mukta text-xl font-bold text-brand-700 dark:text-brand-400"
            >{{ item.price }} EUR</span
          >
          @if (isAdmin) {
          <button
            type="button"
            class="action-button"
            (click)="modifyItem()"
            aria-label="Modificar producto">
            <i class="fa-solid fa-pen text-sm"></i>
          </button>
          } @else if (quantity > 0) {
          <button
            type="button"
            class="action-button bg-neutral-100 text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-red-500/10"
            (click)="removeItem(quantity)"
            aria-label="Quitar del carrito">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
          } @else {
          <button
            type="button"
            class="action-button"
            (click)="addItem()"
            aria-label="Añadir al carrito">
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
          }
        </span>
      </div>
    </div>
    } }
  `,
  styles: [],
})
export class ItemCardComponent {
  @Input() item?: Item;
  @Input() quantity: number = 0;
  @Input() modifyQuantity: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() addItemEvent = new EventEmitter<Item>();
  @Output() modifyItemEvent = new EventEmitter<Item>();
  @Output() removeItemEvent = new EventEmitter<string>();
  @Output() quantityChangeEvent = new EventEmitter<number>();

  readonly defaultImage = DEFAULT_ITEM_IMAGE;

  // The cart needs the compact row with its quantity stepper; every other
  // listing shows the richer vertical card.
  get layout(): ItemCardLayout {
    return this.modifyQuantity ? 'row' : 'grid';
  }

  addItem() {
    this.addItemEvent.emit(this.item!);
  }

  modifyItem() {
    this.modifyItemEvent.emit(this.item!);
  }

  removeItem(quantity: number = 1) {
    for (let index = quantity; index > 0; index--) {
      this.removeItemEvent.emit(this.item!._id);
    }
  }

  onQuantityInput(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    const quantity = Number.isFinite(value)
      ? Math.max(Math.trunc(value), 0)
      : 0;
    this.quantityChangeEvent.emit(quantity);
  }

  constructor() {}
}
