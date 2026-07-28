import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsAdmin } from '../../modules/users/store/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  private store = inject<Store<AppState>>(Store);
  private router = inject(Router);

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
