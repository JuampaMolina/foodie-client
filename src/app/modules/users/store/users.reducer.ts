import { createReducer, on } from '@ngrx/store';
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
import { UsersState } from '../interface/UsersState';

export const usersInitialState: UsersState = {
  user: undefined,
  token: undefined,
  loading: false,
  loaded: false,
  error: undefined,
  resetToken: undefined,
  resetPasswordDone: false,
  adminUsers: [],
  adminUsersLoading: false,
  adminUsersError: undefined,
  adminUsersPage: 1,
  adminUsersTotal: 0,
  adminUsersTotalPages: 1,
};

export const usersReducer = createReducer(
  usersInitialState,

  on(registerUser, (state, { user }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: false,
  })),

  on(registerUserError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(registerUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: false,
  })),

  on(loginUser, (state, { user }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: false,
  })),

  on(loginUserError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(loginUserSuccess, (state, { userSession }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: false,
    user: userSession.user,
    token: userSession.token,
  })),

  on(logoutUser, state => ({
    ...state,
    loading: false,
    loaded: true,
    user: undefined,
    token: undefined,
  })),

  on(forgotPassword, state => ({
    ...state,
    loading: true,
    loaded: false,
    error: false,
    resetToken: undefined,
  })),

  on(forgotPasswordError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(forgotPasswordSuccess, (state, { token }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: false,
    resetToken: token,
  })),

  on(resetPassword, state => ({
    ...state,
    loading: true,
    loaded: false,
    error: false,
    resetPasswordDone: false,
  })),

  on(resetPasswordError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: error.message,
  })),

  on(resetPasswordSuccess, state => ({
    ...state,
    loading: false,
    loaded: true,
    error: false,
    resetPasswordDone: true,
  })),

  on(getUsers, state => ({
    ...state,
    adminUsersLoading: true,
    adminUsersError: undefined,
  })),

  on(getUsersError, (state, { error }) => ({
    ...state,
    adminUsersLoading: false,
    adminUsersError: error.message,
  })),

  on(getUsersSuccess, (state, { users, page, total, totalPages }) => ({
    ...state,
    adminUsersLoading: false,
    adminUsers: users,
    adminUsersPage: page,
    adminUsersTotal: total,
    adminUsersTotalPages: totalPages,
  })),

  on(updateUserRole, state => ({
    ...state,
    adminUsersLoading: true,
    adminUsersError: undefined,
  })),

  on(updateUserRoleError, (state, { error }) => ({
    ...state,
    adminUsersLoading: false,
    adminUsersError: error.message,
  })),

  on(updateUserRoleSuccess, (state, { user }) => ({
    ...state,
    adminUsersLoading: false,
    adminUsers: state.adminUsers.map(u => (u._id === user._id ? user : u)),
  }))
);
