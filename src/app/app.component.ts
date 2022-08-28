import { Component, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';
import { loginUserSuccess } from './modules/users/store/users.actions';
import { ofType } from '@ngrx/effects';
import { UserSession } from './modules/users/interface/UserSession';
import { User } from './modules/users/interface/User';
import { logoutUser } from './modules/users/store/users.actions';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import {
  selectOrdersError,
  selectOrdersMessage,
} from './modules/orders/store/orders.selectors';
import { selectItemsError } from './modules/items/store/items.selectors';
import { selectCategoriesError } from './modules/categories/store/categories.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = "foodie's";
  message = '';
  error = '';

  constructor(
    private store: Store<AppState>,
    private actionListener: ActionsSubject,
    private router: Router
  ) {}

  listenLogin() {
    this.actionListener
      .pipe(ofType(loginUserSuccess))
      .subscribe(({ userSession }) => {
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(userSession.user));
        localStorage.setItem('token', userSession.token);
        if (userSession.user.role === 'admin') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/');
        }
      });
  }

  listenLogout() {
    this.actionListener.pipe(ofType(logoutUser)).subscribe(() => {
      this.router.navigateByUrl('/');
      localStorage.clear();
    });
  }

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
    setTimeout(() => {
      this.error = '';
    }, 5000);
  }

  handleMessage(m: string) {
    clearTimeout();
    this.router.navigateByUrl('/');
    this.message = m;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  ngOnInit(): void {
    this.listenLogin();
    this.listenLogout();
    this.getLocalUser();

    merge(
      this.store.select(selectItemsError),
      this.store.select(selectOrdersError),
      this.store.select(selectCategoriesError)
    ).subscribe(error => this.handleErrors(error));

    merge(this.store.select(selectOrdersMessage)).subscribe(message =>
      this.handleMessage(message)
    );
  }
}
