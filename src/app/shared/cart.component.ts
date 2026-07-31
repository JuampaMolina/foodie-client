import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Item } from 'src/app/modules/items/interface/item';

import {
  addItemToCart,
  createOrder,
  removeItemFromCart,
  setCartItemQuantity,
} from 'src/app/modules/orders/store/orders.actions';
import { CreateOrderCommand } from 'src/app/modules/orders/interface/createOrderCommand';
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
  imports: [ItemCardComponent, ReactiveFormsModule],
  template: `
    <div class="mb-4 flex items-center gap-2">
      <h2 class="title-2">Carrito</h2>
      @if (cartCount() > 0) {
      <span
        class="rounded bg-slate-300 px-2 py-1 text-xl font-bold dark:bg-slate-600"
        >{{ cartCount() }}</span
      >
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
        (quantityChangeEvent)="setQuantity(item, $event)"
        [item]="item"
        [quantity]="getQuantity(item._id)"
        [modifyQuantity]="true">
      </app-item-card>
      }
    </div>
    @if (cart().length > 0) {
    <span
      class="my-2 flex justify-end text-2xl font-semibold text-slate-800 dark:text-slate-100"
      >Total: {{ totalPrice() }} EUR
    </span>
    } @if (cartCount() > 0) {
    <div>
      <label class="form-label" for="address">Dirección de entrega </label>
      <input
        class="form-input"
        id="address"
        type="text"
        placeholder="Dirección de entrega"
        [formControl]="addressControl" />
    </div>
    <button
      (click)="createOrder()"
      class="primary-button"
      [disabled]="addressControl.invalid">
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

  addressControl = new FormControl('', Validators.required);

  createOrder() {
    if (this.addressControl.invalid) {
      return;
    }
    const quantities = new Map<string, number>();
    for (const item of this.cart()) {
      quantities.set(item._id, (quantities.get(item._id) ?? 0) + 1);
    }
    let order: CreateOrderCommand = {
      items: Array.from(quantities, ([item, quantity]) => ({
        item,
        quantity,
      })),
      totalPrice: this.totalPrice(),
      date: new Date(),
      address: this.addressControl.value!,
    };
    this.store.dispatch(createOrder({ order }));
    this.addressControl.reset('');
  }

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  setQuantity(item: Item, quantity: number) {
    this.store.dispatch(setCartItemQuantity({ item, quantity }));
  }

  getQuantity(itemId: string) {
    return this.cart().filter(item => item._id === itemId).length;
  }
}
