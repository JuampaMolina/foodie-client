import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { logoutUser } from '../store/users.actions';
import { selectUser } from '../store/users.selectors';
import { OrdersComponent } from '../../orders/components/orders.component';

@Component({
  selector: 'app-user',
  template: `
    <button (click)="logout()" class="primary-button float-right">
      Cerrar Sesión
    </button>
    <app-orders [userId]="userId()"></app-orders>
  `,
  styles: [],
  imports: [OrdersComponent],
})
export class UserComponent {
  private store = inject<Store<AppState>>(Store);

  private user = toSignal(this.store.select(selectUser));
  userId = computed(() => this.user()?._id ?? '');

  logout() {
    this.store.dispatch(logoutUser());
  }
}
