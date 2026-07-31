import { createAction, props } from '@ngrx/store';
import { User } from '../interface/user';
import { UserSession } from '../interface/UserSession';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { ForgotPasswordResult } from '../interface/ForgotPasswordResult';
import { UpdateUserRoleCommand } from '../interface/updateUserRoleCommand';

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

export const getUsers = createAction(
  '[Users] getUsers',
  props<{ page?: number; limit?: number }>()
);
export const getUsersError = createAction(
  '[Users] getUsersError',
  props<{ error: any }>()
);
export const getUsersSuccess = createAction(
  '[Users] getUsersSuccess',
  props<{ users: User[]; page: number; total: number; totalPages: number }>()
);

export const updateUserRole = createAction(
  '[Users] updateUserRole',
  props<{ roleUpdate: UpdateUserRoleCommand }>()
);
export const updateUserRoleError = createAction(
  '[Users] updateUserRoleError',
  props<{ error: any }>()
);
export const updateUserRoleSuccess = createAction(
  '[Users] updateUserRoleSuccess',
  props<{ user: User }>()
);
