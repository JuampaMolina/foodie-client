import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { UsersApiService } from '../services/users-api.service';
import {
  registerUser,
  registerUserError,
  registerUserSuccess,
  loginUser,
  loginUserError,
  loginUserSuccess,
  logoutUser,
  forgotPassword,
  forgotPasswordError,
  forgotPasswordSuccess,
  resetPassword,
  resetPasswordError,
  resetPasswordSuccess,
  getUsers,
  getUsersError,
  getUsersSuccess,
  updateUserRole,
  updateUserRoleError,
  updateUserRoleSuccess,
} from './users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { Router } from '@angular/router';

const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class UsersEffects {
  private usersApi = inject(UsersApiService);
  private actions$ = inject(Actions);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap(action =>
        this.usersApi.registerUser(action.user).pipe(
          map(user => registerUserSuccess({ user })),
          catchError(error => of(registerUserError({ error })))
        )
      )
    )
  );

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mergeMap(action =>
        this.usersApi.loginUser(action.user).pipe(
          map(userSession => loginUserSuccess({ userSession })),
          catchError(error => of(loginUserError({ error })))
        )
      )
    )
  );

  // Estos dos efectos sólo se disparan como reacción a una acción de un
  // usuario real (enviar el formulario de login, pulsar cerrar sesión), así
  // que en la práctica nunca se ejecutan durante el SSR de una petición
  // anónima. Se guardan igualmente por si en el futuro se sirve alguna
  // ruta protegida en SSR: sin esto, tocar localStorage en el servidor
  // reventaría el render.
  loginUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginUserSuccess),
        tap(({ userSession }) => {
          if (this.isBrowser) {
            localStorage.clear();
            localStorage.setItem('user', JSON.stringify(userSession.user));
            localStorage.setItem('token', userSession.token);
          }
          userSession.user.role === 'admin'
            ? this.router.navigateByUrl('/admin')
            : this.router.navigateByUrl('/');
        })
      );
    },
    { dispatch: false }
  );

  logoutUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logoutUser),
        tap(() => {
          this.router.navigateByUrl('/');
          if (this.isBrowser) {
            localStorage.clear();
          }
        })
      );
    },
    { dispatch: false }
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgotPassword),
      mergeMap(action =>
        this.usersApi.forgotPassword(action.email).pipe(
          map(result => forgotPasswordSuccess(result)),
          catchError(error => of(forgotPasswordError({ error })))
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      mergeMap(action =>
        this.usersApi.resetPassword(action.token, action.password).pipe(
          map(() => resetPasswordSuccess()),
          catchError(error => of(resetPasswordError({ error })))
        )
      )
    )
  );

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsers),
      mergeMap(({ page = 1, limit = DEFAULT_PAGE_SIZE }) =>
        this.usersApi.getUsers(page, limit).pipe(
          map(({ items, page, total, totalPages }) =>
            getUsersSuccess({ users: items, page, total, totalPages })
          ),
          catchError(error => of(getUsersError({ error })))
        )
      )
    )
  );

  updateUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserRole),
      mergeMap(action =>
        this.usersApi.updateUserRole(action.roleUpdate).pipe(
          map(user => updateUserRoleSuccess({ user })),
          catchError(error => of(updateUserRoleError({ error })))
        )
      )
    )
  );
}
