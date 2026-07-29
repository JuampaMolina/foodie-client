import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs';
import { AppState } from '../store/app.reducers';
import { selectToken } from '../modules/users/store/users.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject<Store<AppState>>(Store);

  return store.select(selectToken).pipe(
    take(1),
    map(token =>
      token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req
    ),
    switchMap(request => next(request))
  );
};
