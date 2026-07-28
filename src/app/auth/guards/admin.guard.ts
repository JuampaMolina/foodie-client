import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsAdmin } from '../../modules/users/store/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(selectIsAdmin).pipe(
      map(isAdmin => {
        if (!isAdmin) {
          return this.router.createUrlTree(['/']);
        }
        return true;
      })
    );
  }
}
