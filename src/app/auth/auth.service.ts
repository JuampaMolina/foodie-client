import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { restoreUserSession } from '../modules/users/store/users.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject<Store<AppState>>(Store);

  public getLocalUser() {
    let retrievedUser = localStorage.getItem('user');
    let retrievedToken = localStorage.getItem('token');
    if (retrievedUser !== null && retrievedToken !== null) {
      let userSession = {
        user: JSON.parse(retrievedUser),
        token: retrievedToken,
      };
      this.store.dispatch(restoreUserSession({ userSession }));
    }
  }
}
