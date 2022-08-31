import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsAuthenticated } from '../../modules/users/store/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(selectIsAuthenticated).pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.createUrlTree(['/login']);
        }
        return true;
      })
    );
  }
}
