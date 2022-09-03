import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { merge } from 'rxjs';
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
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="toast-error animate">
      {{ error }}
    </div>

    <div *ngIf="message" class="toast-message animate">
      {{ message }}
    </div>
  `,
  styles: [
    '@keyframes fade-in-out {0%, 100% {opacity: 0}; 50% {opacity: 1}}; .animate { animation: fade-in-out 4s ease };',
  ],
})
export class ToastComponent implements OnInit {
  message = '';
  error = '';

  constructor(private store: Store<AppState>, private router: Router) {}

  handleErrors(e: string) {
    clearTimeout();
    if (e === 'jwt expired') {
      this.router.navigateByUrl('/login');
      this.error = 'La sesión ha caducado, vuelve a iniciar sesión';
    }
    this.error = e;
    setTimeout(() => {
      this.error = '';
    }, 4000);
  }

  handleMessage(m: string) {
    clearTimeout();
    this.router.navigateByUrl('/');
    this.message = m;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

  ngOnInit(): void {
    merge(
      this.store.select(selectItemsError),
      this.store.select(selectOrdersError),
      this.store.select(selectCategoriesError),
      this.store.select(selectUsersError)
    ).subscribe(error => this.handleErrors(error));

    merge(this.store.select(selectOrdersMessage)).subscribe(message =>
      this.handleMessage(message)
    );
  }
}
