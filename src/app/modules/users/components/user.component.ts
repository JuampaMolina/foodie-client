import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { selectUser } from '../store/users.selectors';
import { logoutUser } from '../store/users.actions';

@Component({
  selector: 'app-user',
  template: ` <h2 class="title-2">Hola {{ userName }}!</h2>
    <button (click)="logout()" class="primary-button">Cerrar Sesión</button>`,
  styles: [],
})
export class UserComponent implements OnInit {
  userName: string = '';

  constructor(private store: Store<AppState>) {}

  logout() {
    this.store.dispatch(logoutUser());
  }

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .subscribe(user => (this.userName = user?.name ?? ''));
  }
}
