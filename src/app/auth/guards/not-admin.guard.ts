import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectIsAdmin } from 'src/app/modules/users/store/users.selectors';
import { AppState } from 'src/app/store/app.reducers';

@Injectable({
  providedIn: 'root',
})
export class NotAdminGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(selectIsAdmin).pipe(
      map(isAdmin => {
        if (isAdmin) {
          return this.router.createUrlTree(['/admin']);
        }
        return true;
      })
    );
  }
}
