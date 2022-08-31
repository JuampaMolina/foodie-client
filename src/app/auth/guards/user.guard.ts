import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsUser } from '../../modules/users/store/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(selectIsUser).pipe(
      map(isUser => {
        if (!isUser) {
          return this.router.createUrlTree(['/login']);
        }
        return true;
      })
    );
  }
}
