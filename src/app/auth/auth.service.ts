import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { loginUserSuccess } from '../modules/users/store/users.actions';
import { selectToken } from '../modules/users/store/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private store: Store<AppState>) {}

  public getLocalUser() {
    let retrievedUser = localStorage.getItem('user');
    let retrievedToken = localStorage.getItem('token');
    if (retrievedUser !== null && retrievedToken !== null) {
      let userSession = {
        user: JSON.parse(retrievedUser),
        token: retrievedToken,
      };
      this.store.dispatch(loginUserSuccess({ userSession }));
    }
  }

  public getToken() {
    let token: string = '';
    this.store
      .select(selectToken)
      .pipe(map(t => (t === undefined ? '' : t)))
      .subscribe(t => (token = t));

    return token;
  }

  public getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return { headers: this.appendAuthHeader(headers) };
  }

  public appendAuthHeader(headers: HttpHeaders) {
    const token = this.getToken();

    if (token === '') {
      return headers;
    }

    const tokenValue = 'Bearer ' + token;
    return headers.set('Authorization', tokenValue);
  }
}
