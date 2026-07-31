import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../interface/item';

const DEFAULT_ITEM_IMAGE = 'assets/categories/placeholder.svg';

@Component({
  selector: 'app-item-card',
  template: `
    @if (item) {
    <div
      class="min-h-32 flex h-full gap-4 rounded-2xl border border-neutral-200/70 bg-white p-3 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <img
        [src]="item.category?.image || defaultImage"
        [alt]="item.name"
        class="h-full w-24 shrink-0 rounded-xl bg-neutral-100 object-cover dark:bg-neutral-800" />
      <div class="flex grow flex-col overflow-hidden py-0.5">
        <div class="flex flex-wrap items-baseline gap-x-2">
          <span class="font-semibold text-neutral-900 dark:text-white">{{
            item.name
          }}</span>
          <span
            class="text-xs font-medium uppercase tracking-wide text-neutral-400"
            >{{ item.category?.name }}</span
          >
        </div>
        <span
          class="grow text-sm font-light text-neutral-500 dark:text-neutral-400"
          >{{ item.description }}</span
        >
        <span class="flex items-center justify-between pt-1">
          <span
            class="font-mukta text-lg font-bold text-brand-700 dark:text-brand-400"
            >{{ item.price }} EUR</span
          >
          @if (!isAdmin) {
          <span class="flex items-center justify-center gap-1.5 text-lg">
            @if (quantity > 0) {
            <i
              (click)="removeItem(quantity)"
              class="quantity-icon fa-solid fa-square-xmark"></i>
            } @if (quantity > 0 && modifyQuantity) {
            <i
              (click)="removeItem()"
              class="quantity-icon fa-solid fa-square-minus"></i>
            } @if (quantity > 0 && modifyQuantity) {
            <input
              type="number"
              min="0"
              class="form-input w-14 select-none px-1 py-1 text-center text-sm"
              [value]="quantity"
              (change)="onQuantityInput($event)" />
            } @if (quantity < 1 || modifyQuantity) {
            <i
              (click)="addItem()"
              class="quantity-icon fa-solid fa-square-plus">
            </i>
            }
          </span>
          } @if (isAdmin) {
          <span>
            <i
              (click)="modifyItem()"
              class="quantity-icon fa-solid fa-square-pen text-2xl"></i>
          </span>
          }
        </span>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .quantity-icon {
        @apply cursor-pointer text-neutral-500 transition hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400;
      }
    `,
  ],
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
