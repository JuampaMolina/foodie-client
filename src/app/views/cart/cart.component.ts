import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/modules/items/interface/item';
import {
  addItemToCart,
  createOrder,
  removeItemFromCart,
} from 'src/app/modules/orders/store/orders.actions';
import { AppState } from 'src/app/store/app.reducers';
import {
  selectCartTotalPrice,
  selectCartCount,
} from '../../modules/orders/store/orders.selectors';
import {
  selectCart,
  selectCartUniqueItems,
} from '../../modules/orders/store/orders.selectors';

@Component({
  selector: 'app-cart',
  template: `
    <div class="mb-4 flex items-center gap-2">
      <h2 class="title-2 ">Carrito</h2>
      <span
        *ngIf="cartCount > 0"
        class="rounded bg-slate-300 px-2 py-1 text-xl font-bold"
        >{{ cartCount }}</span
      >
    </div>
    <span *ngIf="cartCount < 1" class="text-xl font-semibold"
      >El carrito está vacío</span
    >
    <div class="flex flex-col gap-4">
      <app-item-card
        *ngFor="let item of uniqueItems"
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [item]="item"
        [quantity]="getQuantity(item._id)"
        [modifyQuantity]="true">
      </app-item-card>
    </div>
    <span
      class="my-2 flex justify-end text-2xl font-semibold text-slate-800"
      *ngIf="cart.length > 0"
      >Total: {{ totalPrice }} EUR
    </span>
    <button
      (click)="createOrder()"
      *ngIf="cartCount > 0"
      class="primary-button">
      Realizar pedido
    </button>
  `,
  styles: [],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Item[] = [];
  uniqueItems: Item[] = [];
  cartCount: number = 0;
  totalPrice: number = 0;

  private onDestroy = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  toUnique(items: Item[]): Item[] {
    return items.filter((x, i, a) => a.indexOf(x) == i);
  }

  createOrder() {
    let order = {
      items: this.cart.map(item => item._id),
      totalPrice: this.totalPrice,
      date: new Date().toLocaleDateString(),
    };
    this.store.dispatch(createOrder({ order }));
  }

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  getQuantity(itemId: string) {
    return this.cart.filter(item => item._id === itemId).length;
  }

  clearCart() {
    this.cart = [];
    this.uniqueItems = [];
  }

  ngOnInit() {
    this.store
      .select(selectCart)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(cart => (this.cart = cart));
    this.store
      .select(selectCartUniqueItems)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(cart => (this.uniqueItems = cart));
    this.store
      .select(selectCartTotalPrice)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(totalPrice => (this.totalPrice = totalPrice));
    this.store
      .select(selectCartCount)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(cartCount => (this.cartCount = cartCount));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
