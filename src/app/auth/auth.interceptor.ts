import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppState } from '../store/app.reducers';
import { selectToken } from '../modules/users/store/users.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject<Store<AppState>>(Store);

  // Sin esta guarda, el token se adjuntaría a cualquier petición HTTP de la
  // app, incluida la subida directa a Cloudinary (dominio ajeno) que hace
  // CategoryImageUploadService.
  if (!req.url.startsWith(environment.apiBaseUri)) {
    return next(req);
  }

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
