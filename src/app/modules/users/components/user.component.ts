import { Component, OnInit } from '@angular/core';
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
    <app-orders [userId]="userId"></app-orders>
  `,
  styles: [],
  imports: [OrdersComponent],
})
export class UserComponent implements OnInit {
  userName: string = '';
  userId: string = '';
  isAdmin: boolean = false;

  constructor(private store: Store<AppState>) {}

  logout() {
    this.store.dispatch(logoutUser());
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      this.userName = user?.name ?? '';
      this.userId = user?._id ?? '';
      this.isAdmin = user?.role === 'admin';
    });
  }
}
