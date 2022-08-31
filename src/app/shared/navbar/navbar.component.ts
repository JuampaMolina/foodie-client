import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/modules/orders/store/orders.selectors';
import { logoutUser } from 'src/app/modules/users/store/users.actions';
import {
  selectIsAdmin,
  selectUser,
} from 'src/app/modules/users/store/users.selectors';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-navbar',
  template: `
    <nav
      class="mb-8 flex items-center justify-between rounded bg-slate-800 p-4 text-slate-200">
      <div class="flex gap-4">
        <h1 class="font-mukta text-4xl font-extrabold">
          {{ title }}
        </h1>
        <button
          *ngIf="isAdmin"
          class="rounded bg-slate-600 p-2 font-semibold"
          routerLink="/admin">
          Admin
        </button>
      </div>
      <button (click)="logout()" *ngIf="isAdmin">
        <i class="fa-solid fa-right-from-bracket text-xl"></i>
      </button>
      <div *ngIf="!isAdmin" class="mr-2 space-x-4 text-xl sm:space-x-6">
        <button routerLink="/">
          <i class="fa-solid fa-house"></i>
        </button>
        <button routerLink="/user">
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
      </div>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit {
  @Input() title: string = '';
  userName: string = '';
  isAdmin: boolean = false;
  cartCount: number = 0;

  constructor(private store: Store<AppState>) {}

  logout() {
    this.store.dispatch(logoutUser());
  }

  ngOnInit() {
    this.store
      .select(selectCartCount)
      .subscribe(cartCount => (this.cartCount = cartCount));

    this.store
      .select(selectUser)
      .subscribe(user => (this.userName = user?.name ?? ''));

    this.store
      .select(selectIsAdmin)
      .subscribe(isAdmin => (this.isAdmin = isAdmin));
  }
}
