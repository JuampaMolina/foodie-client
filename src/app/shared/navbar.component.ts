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
      class="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex items-center gap-3 sm:gap-4">
          <a routerLink="/" class="flex items-center gap-2">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <i class="fa-solid fa-utensils text-sm"></i>
            </span>
            <h1
              class="font-mukta text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {{ title }}
            </h1>
          </a>
          @if (isAdmin()) {
          <a
            class="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            routerLink="/admin">
            Admin
          </a>
          }
        </div>
        <div class="flex items-center gap-1 text-lg sm:gap-2">
          <button
            class="nav-icon-button"
            (click)="toggleTheme()"
            [attr.aria-label]="themeToggleLabel">
            <i
              class="fa-solid"
              [class.fa-moon]="isDark()"
              [class.fa-sun]="!isDark()"></i>
          </button>
          @if (isAdmin()) {
          <button
            class="nav-icon-button"
            (click)="logout()"
            aria-label="Cerrar sesión">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
          } @if (!isAdmin()) {
          <button class="nav-icon-button" routerLink="/" aria-label="Inicio">
            <i class="fa-solid fa-house"></i>
          </button>
          <button
            class="nav-icon-button"
            routerLink="/user"
            aria-label="Mi cuenta">
            <i class="fa-solid fa-user"></i>
          </button>
          <button
            class="nav-icon-button relative"
            routerLink="/cart"
            aria-label="Carrito">
            <i class="fa-solid fa-cart-shopping"></i>
            @if (cartCount() > 0) {
            <span
              class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white"
              >{{ cartCount() }}</span
            >
            }
          </button>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .nav-icon-button {
        @apply flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white;
      }
    `,
  ],
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
