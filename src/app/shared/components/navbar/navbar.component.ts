import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/modules/orders/store/orders.selectors';
import { AppState } from 'src/app/store/app.reducers';
import { selectUser } from '../../../modules/users/store/users.selectors';

@Component({
  selector: 'app-navbar',
  template: `
    <nav
      class="mb-8 flex items-baseline justify-between rounded bg-slate-800 p-4 text-slate-200">
      <h1 class="font-mukta text-4xl font-extrabold">
        {{ title }}
      </h1>
      <span class="mr-2 space-x-4 text-xl">
        <button routerLink="/">Home</button>
        <button routerLink="/admin">Admin</button>
        <button [routerLink]="userName ? '/user' : '/user/login'">
          <span *ngIf="userName" class="mr-2 ml-4">{{ userName }}</span>
          <i class="fa-solid fa-user"></i>
        </button>
        <button class="relative" routerLink="/cart">
          <i class="fa-solid fa-cart-shopping"></i>
          <span
            *ngIf="cartCount > 0"
            class="absolute -top-3 -right-3 rounded-full bg-slate-200 px-1 text-sm font-semibold text-slate-800"
            >{{ cartCount }}</span
          >
        </button>
      </span>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit {
  @Input() title: string = '';
  userName: string = '';
  cartCount: number = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .select(selectCartCount)
      .subscribe(cartCount => (this.cartCount = cartCount));

    this.store
      .select(selectUser)
      .subscribe(user => (this.userName = user?.name ?? ''));
  }
}
