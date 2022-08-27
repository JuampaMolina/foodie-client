import { createAction, props } from '@ngrx/store';
import { User } from '../interface/User';
import { UserSession } from '../interface/UserSession';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { LoginUserCommand } from '../interface/LoginUserCommand';

export const registerUser = createAction(
  '[Users] registerUser',
  props<{ user: RegisterUserCommand }>()
);
export const registerUserError = createAction(
  '[Users] registerUserError',
  props<{ error: any }>()
);
export const registerUserSuccess = createAction(
  '[Users] registerUserSuccess',
  props<{ user: User }>()
);

export const loginUser = createAction(
  '[Users] loginUser',
  props<{ user: LoginUserCommand }>()
);
export const loginUserError = createAction(
  '[Users] loginUserError',
  props<{ error: any }>()
);
export const loginUserSuccess = createAction(
  '[Users] loginUserSuccess',
  props<{ userSession: UserSession }>()
);

export const logoutUser = createAction('[Users] logoutUser');
