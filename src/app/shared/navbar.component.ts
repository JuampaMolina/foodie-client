import { Component, Input, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/modules/orders/store/orders.selectors';
import { logoutUser } from 'src/app/modules/users/store/users.actions';
import { selectIsAdmin } from 'src/app/modules/users/store/users.selectors';
import { AppState } from 'src/app/store/app.reducers';
import { ThemeService } from './theme.service';

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
      <div class="flex items-center gap-4 text-xl">
        <button (click)="toggleTheme()" [attr.aria-label]="themeToggleLabel">
          <i
            class="fa-solid"
            [class.fa-moon]="isDark()"
            [class.fa-sun]="!isDark()"></i>
        </button>
        @if (isAdmin()) {
        <button (click)="logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
        } @if (!isAdmin()) {
        <div class="mr-2 space-x-4 sm:space-x-6">
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
      </div>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent {
  private store = inject<Store<AppState>>(Store);
  private themeService = inject(ThemeService);

  @Input() title: string = '';

  cartCount = toSignal(this.store.select(selectCartCount), { initialValue: 0 });
  isAdmin = toSignal(this.store.select(selectIsAdmin), { initialValue: false });

  isDark = computed(() => this.themeService.theme() === 'dark');

  get themeToggleLabel(): string {
    return this.isDark() ? 'Activar modo claro' : 'Activar modo oscuro';
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  logout() {
    this.store.dispatch(logoutUser());
  }
}
