import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { selectIsUser } from '../../modules/users/store/users.selectors';

export const userGuard: CanActivateFn = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  return store.select(selectIsUser).pipe(
    map(isUser => {
      if (!isUser) {
        return router.createUrlTree(['/login']);
      }
      return true;
    })
  );
};
