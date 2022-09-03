import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';
import { loginUserSuccess } from './modules/users/store/users.actions';
import { UserSession } from './modules/users/interface/UserSession';
import { User } from './modules/users/interface/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = "foodie's";
  // loading?: boolean;
  // counter?: boolean;

  constructor(private store: Store<AppState>) {}

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
  }
}
