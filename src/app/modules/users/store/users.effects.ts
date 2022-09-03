import { Injectable } from '@angular/core';
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
} from './users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { Router } from '@angular/router';

@Injectable()
export class UsersEffects {
  constructor(
    private usersApi: UsersApiService,
    private actions$: Actions,
    private router: Router
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap(action =>
        this.usersApi.registerUser(action.user).pipe(
          map(user => registerUserSuccess({ user })),
          catchError(error => of(registerUserError(error)))
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
          catchError(error => of(loginUserError(error)))
        )
      )
    )
  );

  loginUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginUserSuccess),
        tap(({ userSession }) => {
          localStorage.clear();
          localStorage.setItem('user', JSON.stringify(userSession.user));
          localStorage.setItem('token', userSession.token);
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
          localStorage.clear();
        })
      );
    },
    { dispatch: false }
  );
}
