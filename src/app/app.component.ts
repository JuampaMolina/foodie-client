import { Component, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';
import { loginUserSuccess } from './modules/users/store/users.actions';
import { ofType } from '@ngrx/effects';
import { UserSession } from './modules/users/interface/UserSession';
import { User } from './modules/users/interface/User';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import {
  selectOrdersError,
  selectOrdersMessage,
} from './modules/orders/store/orders.selectors';
import {
  selectItemsError,
  selectItemsLoading,
} from './modules/items/store/items.selectors';
import {
  selectCategoriesError,
  selectCategoriesLoading,
} from './modules/categories/store/categories.selectors';
import {
  selectUsersError,
  selectUsersLoading,
} from './modules/users/store/users.selectors';
import { selectOrdersLoading } from './modules/orders/store/orders.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = "foodie's";
  loading?: boolean;
  counter?: boolean;
  message = '';
  error = '';

  constructor(private store: Store<AppState>, private router: Router) {}

  getLocalUser() {
    let retrievedUser = localStorage.getItem('user');
    let retrievedToken = localStorage.getItem('token');
    if (retrievedUser !== null && retrievedToken !== null) {
      let parsedUser: User = JSON.parse(retrievedUser);
      let userSession: UserSession = {
        user: parsedUser,
        token: retrievedToken,
      };
      this.store.dispatch(loginUserSuccess({ userSession }));
    }
  }

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

  // setLoading(loading: boolean) {
  //   if (loading) {
  //     this.counter = true;
  //     setTimeout(() => {
  //       this.counter = false;
  //     }, 500);
  //   }
  // }

  ngOnInit(): void {
    this.getLocalUser();

    merge(
      this.store.select(selectItemsError),
      this.store.select(selectOrdersError),
      this.store.select(selectCategoriesError),
      this.store.select(selectUsersError)
    ).subscribe(error => this.handleErrors(error));

    // merge(
    //   this.store.select(selectItemsLoading),
    //   this.store.select(selectOrdersLoading),
    //   this.store.select(selectCategoriesLoading),
    //   this.store.select(selectUsersLoading)
    // ).subscribe(loading => this.setLoading(loading));

    merge(this.store.select(selectOrdersMessage)).subscribe(message =>
      this.handleMessage(message)
    );
  }
}
