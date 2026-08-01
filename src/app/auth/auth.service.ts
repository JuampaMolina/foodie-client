import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { restoreUserSession } from '../modules/users/store/users.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject<Store<AppState>>(Store);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public getLocalUser() {
    // localStorage no existe en el servidor; sin esta guarda, renderizar
    // cualquier página en SSR reventaría en cuanto AppComponent llamara a
    // este método en ngOnInit.
    if (!this.isBrowser) {
      return;
    }
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
