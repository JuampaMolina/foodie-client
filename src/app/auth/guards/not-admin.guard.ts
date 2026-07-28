import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectIsAdmin } from 'src/app/modules/users/store/users.selectors';
import { AppState } from 'src/app/store/app.reducers';

export const notAdminGuard: CanActivateFn = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  return store.select(selectIsAdmin).pipe(
    map(isAdmin => {
      if (isAdmin) {
        return router.createUrlTree(['/admin']);
      }
      return true;
    })
  );
};
