import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { UsersState } from '../interface/UsersState';

const _selectUsersState = (state: AppState): UsersState => state.users;

export const selectUsersState = createSelector(
  _selectUsersState,
  (state: UsersState) => state
);

export const selectUsersError = createSelector(
  _selectUsersState,
  (state: UsersState) => state.error
);

export const selectUsersLoading = createSelector(
  _selectUsersState,
  (state: UsersState) => state.loading
);

export const selectUser = createSelector(
  _selectUsersState,
  (state: UsersState) => state.user
);

export const selectToken = createSelector(
  _selectUsersState,
  (state: UsersState) => state.token
);

export const selectIsAdmin = createSelector(
  _selectUsersState,
  (state: UsersState) => state.user?.role === 'admin'
);

export const selectIsUser = createSelector(
  _selectUsersState,
  (state: UsersState) => state.user?.role === 'user'
);

export const selectIsAuthenticated = createSelector(
  _selectUsersState,
  (state: UsersState) => state.user !== undefined
);
