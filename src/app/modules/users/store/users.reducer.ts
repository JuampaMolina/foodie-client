import { createReducer, on } from '@ngrx/store';
import {
  registerUser,
  registerUserError,
  registerUserSuccess,
  loginUser,
  loginUserError,
  loginUserSuccess,
  logoutUser,
} from './users.actions';
import { UsersState } from '../interface/UsersState';

export const ordersInitalState: UsersState = {
  user: undefined,
  token: undefined,
  loading: false,
  loaded: false,
  error: undefined,
};

export const usersReducer = createReducer(
  ordersInitalState,

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
  }))
);
