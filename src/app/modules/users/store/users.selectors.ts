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

export const selectResetToken = createSelector(
  _selectUsersState,
  (state: UsersState) => state.resetToken
);

export const selectResetPasswordDone = createSelector(
  _selectUsersState,
  (state: UsersState) => state.resetPasswordDone
);

export const selectAdminUsers = createSelector(
  _selectUsersState,
  (state: UsersState) => state.adminUsers
);

export const selectAdminUsersLoading = createSelector(
  _selectUsersState,
  (state: UsersState) => state.adminUsersLoading
);

export const selectAdminUsersPage = createSelector(
  _selectUsersState,
  (state: UsersState) => state.adminUsersPage
);

export const selectAdminUsersTotalPages = createSelector(
  _selectUsersState,
  (state: UsersState) => state.adminUsersTotalPages
);
