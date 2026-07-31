import { createAction, props } from '@ngrx/store';
import { User } from '../interface/user';
import { UserSession } from '../interface/UserSession';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { ForgotPasswordResult } from '../interface/ForgotPasswordResult';

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

export const forgotPassword = createAction(
  '[Users] forgotPassword',
  props<{ email: string }>()
);
export const forgotPasswordError = createAction(
  '[Users] forgotPasswordError',
  props<{ error: any }>()
);
export const forgotPasswordSuccess = createAction(
  '[Users] forgotPasswordSuccess',
  props<ForgotPasswordResult>()
);

export const resetPassword = createAction(
  '[Users] resetPassword',
  props<{ token: string; password: string }>()
);
export const resetPasswordError = createAction(
  '[Users] resetPasswordError',
  props<{ error: any }>()
);
export const resetPasswordSuccess = createAction(
  '[Users] resetPasswordSuccess'
);
