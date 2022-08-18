import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Item } from 'src/app/modules/items/interface/item';
import {
  addItemToCart,
  removeItemFromCart,
} from 'src/app/modules/orders/store/orders.actions';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-cart',
  template: ` <h2 class="my-2 text-5xl font-bold tracking-wide text-slate-800">
      Carrito
    </h2>
    <div class="flex flex-col gap-4">
      <app-item-card
        *ngFor="let item of toUnique(cart)"
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [item]="item"
        [inCart]="inCart(item._id)">
      </app-item-card>
    </div>
    <span
      class="my-2 flex justify-end text-2xl font-semibold text-slate-800"
      *ngIf="cart.length > 0"
      >Total: {{ totalPrice }} EUR</span
    >`,
  styles: [],
})
export class CartComponent implements OnInit {
  cart: Item[] = [];
  totalPrice: number = 0;
  // uniqueItems: Item[] = [];

  constructor(private store: Store<AppState>) {}

  toUnique(items: Item[]): Item[] {
    return items.filter((x, i, a) => a.indexOf(x) == i);
  }

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
    // console.log(this.cart);
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  inCart(itemId: string) {
    return this.cart.filter(item => item._id === itemId).length;
  }

  ngOnInit() {
    this.store.subscribe(({ orders }) => {
      this.cart = orders.cart;
      this.totalPrice = 0;
      orders.cart.map(i => {
        this.totalPrice = this.totalPrice + i.price;
      });
    });
  }
}
