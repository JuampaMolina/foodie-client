import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsAuthenticated } from '../../modules/users/store/users.selectors';

export const authenticatedGuard: CanActivateFn = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return router.createUrlTree(['/login']);
      }
      return true;
    })
  );
};
