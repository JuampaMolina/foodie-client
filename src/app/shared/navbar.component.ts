import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/modules/orders/store/orders.selectors';
import { logoutUser } from 'src/app/modules/users/store/users.actions';
import { selectIsAdmin } from 'src/app/modules/users/store/users.selectors';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  template: `
    <nav
      class="mb-8 flex items-center justify-between rounded bg-slate-800 p-4 text-slate-200">
      <div class="flex gap-4">
        <h1 class="font-mukta text-4xl font-extrabold">
          {{ title }}
        </h1>
        @if (isAdmin()) {
        <button
          class="rounded bg-slate-600 p-2 font-semibold"
          routerLink="/admin">
          Admin
        </button>
        }
      </div>
      @if (isAdmin()) {
      <button (click)="logout()">
        <i class="fa-solid fa-right-from-bracket text-xl"></i>
      </button>
      } @if (!isAdmin()) {
      <div class="mr-2 space-x-4 text-xl sm:space-x-6">
        <button routerLink="/">
          <i class="fa-solid fa-house"></i>
        </button>
        <button routerLink="/user">
          <i class="fa-solid fa-user"></i>
        </button>
        <button class="relative" routerLink="/cart">
          <i class="fa-solid fa-cart-shopping"></i>
          @if (cartCount() > 0) {
          <span
            class="absolute -top-3 -right-3 rounded-full bg-slate-200 px-1 text-sm font-semibold text-slate-800"
            >{{ cartCount() }}</span
          >
          }
        </button>
      </div>
      }
    </nav>
  `,
  styles: [],
})
export class NavbarComponent {
  private store = inject<Store<AppState>>(Store);

  @Input() title: string = '';

  cartCount = toSignal(this.store.select(selectCartCount), { initialValue: 0 });
  isAdmin = toSignal(this.store.select(selectIsAdmin), { initialValue: false });

  logout() {
    this.store.dispatch(logoutUser());
  }
}
