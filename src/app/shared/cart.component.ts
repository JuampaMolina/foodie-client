import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Item } from 'src/app/modules/items/interface/item';

import {
  addItemToCart,
  createOrder,
  removeItemFromCart,
} from 'src/app/modules/orders/store/orders.actions';
import { AppState } from 'src/app/store/app.reducers';
import {
  selectCart,
  selectCartCount,
  selectCartTotalPrice,
  selectCartUniqueItems,
} from '../modules/orders/store/orders.selectors';
import { ItemCardComponent } from '../modules/items/components/item-card.component';

@Component({
  selector: 'app-cart',
  imports: [ItemCardComponent],
  template: `
    <div class="mb-4 flex items-center gap-2">
      <h2 class="title-2">Carrito</h2>
      @if (cartCount() > 0) {
      <span class="rounded bg-slate-300 px-2 py-1 text-xl font-bold">{{
        cartCount()
      }}</span>
      }
    </div>
    @if (cartCount() < 1) {
    <span class="text-xl font-semibold">El carrito está vacío</span>
    }
    <div class="flex flex-col gap-4">
      @for (item of uniqueItems(); track item) {
      <app-item-card
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [item]="item"
        [quantity]="getQuantity(item._id)"
        [modifyQuantity]="true">
      </app-item-card>
      }
    </div>
    @if (cart().length > 0) {
    <span class="my-2 flex justify-end text-2xl font-semibold text-slate-800"
      >Total: {{ totalPrice() }} EUR
    </span>
    } @if (cartCount() > 0) {
    <button (click)="createOrder()" class="primary-button">
      Realizar pedido
    </button>
    }
  `,
  styles: [],
})
export class CartComponent {
  private store = inject<Store<AppState>>(Store);

  cart = toSignal(this.store.select(selectCart), { initialValue: [] });
  uniqueItems = toSignal(this.store.select(selectCartUniqueItems), {
    initialValue: [],
  });
  totalPrice = toSignal(this.store.select(selectCartTotalPrice), {
    initialValue: 0,
  });
  cartCount = toSignal(this.store.select(selectCartCount), { initialValue: 0 });

  createOrder() {
    let order = {
      items: this.cart().map(item => item._id),
      totalPrice: this.totalPrice(),
      date: new Date(),
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
    return this.cart().filter(item => item._id === itemId).length;
  }
}
