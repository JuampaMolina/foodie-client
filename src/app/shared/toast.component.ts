import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { selectCategoriesError } from '../modules/categories/store/categories.selectors';
import { selectItemsError } from '../modules/items/store/items.selectors';
import {
  selectOrdersError,
  selectOrdersMessage,
} from '../modules/orders/store/orders.selectors';
import { selectUsersError } from '../modules/users/store/users.selectors';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
    @if (error()) {
    <div class="toast-error animate">
      {{ error() }}
    </div>
    } @if (message()) {
    <div class="toast-message animate">
      {{ message() }}
    </div>
    }
  `,
  styles: [
    '@keyframes fade-in-out {0%, 100% {opacity: 0}; 50% {opacity: 1}}; .animate { animation: fade-in-out 4s ease };',
  ],
})
export class ToastComponent {
  private store = inject<Store<AppState>>(Store);
  private router = inject(Router);

  private itemsError = toSignal(this.store.select(selectItemsError));
  private ordersError = toSignal(this.store.select(selectOrdersError));
  private categoriesError = toSignal(this.store.select(selectCategoriesError));
  private usersError = toSignal(this.store.select(selectUsersError));
  private ordersMessage = toSignal(this.store.select(selectOrdersMessage));

  message = signal('');
  error = signal('');

  private errorTimeout?: ReturnType<typeof setTimeout>;
  private messageTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => this.handleErrors(this.itemsError() ?? ''));
    effect(() => this.handleErrors(this.ordersError() ?? ''));
    effect(() => this.handleErrors(this.categoriesError() ?? ''));
    effect(() => this.handleErrors(this.usersError() ?? ''));
    effect(() => this.handleMessage(this.ordersMessage() ?? ''));
  }

  handleErrors(e: string) {
    clearTimeout(this.errorTimeout);
    if (e === 'jwt expired') {
      this.router.navigateByUrl('/login');
      this.error.set('La sesión ha caducado, vuelve a iniciar sesión');
    }
    this.error.set(e);
    this.errorTimeout = setTimeout(() => {
      this.error.set('');
    }, 4000);
  }

  handleMessage(m: string) {
    clearTimeout(this.messageTimeout);
    this.router.navigateByUrl('/');
    this.message.set(m);
    this.messageTimeout = setTimeout(() => {
      this.message.set('');
    }, 4000);
  }
}
