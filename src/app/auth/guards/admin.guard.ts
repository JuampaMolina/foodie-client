import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsAdmin } from '../../modules/users/store/users.selectors';

export const adminGuard: CanActivateFn = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  return store.select(selectIsAdmin).pipe(
    map(isAdmin => {
      if (!isAdmin) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );
};
