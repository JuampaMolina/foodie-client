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

@Injectable()
export class UsersEffects {
  constructor(
    private usersApi: UsersApiService,
    private actions$: Actions,
    private store: Store<AppState>
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
}
