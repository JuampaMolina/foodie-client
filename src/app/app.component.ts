import { Component, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';
import { loginUserSuccess } from './modules/users/store/users.actions';
import { ofType } from '@ngrx/effects';
import { UserSession } from './modules/users/interface/UserSession';
import { User } from './modules/users/interface/User';
import { logoutUser } from './modules/users/store/users.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = "foodie's";

  constructor(
    private store: Store<AppState>,
    private actionListener: ActionsSubject,
    private router: Router
  ) {}

  listenLogin() {
    this.actionListener
      .pipe(ofType(loginUserSuccess))
      .subscribe(({ userSession }) => {
        localStorage.setItem('user', JSON.stringify(userSession.user));
        localStorage.setItem('token', JSON.stringify(userSession.token));
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

  ngOnInit(): void {
    this.listenLogin();
    this.listenLogout();
    this.getLocalUser();
  }
}
