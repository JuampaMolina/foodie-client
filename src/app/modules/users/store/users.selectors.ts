import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { UsersState } from '../interface/UsersState';

const _selectUsersState = (state: AppState): UsersState => state.users;

export const selectUsersState = createSelector(
  _selectUsersState,
  (state: UsersState) => state
);

export const selectUser = createSelector(
  _selectUsersState,
  (state: UsersState) => state.user
);

export const selectToken = createSelector(
  _selectUsersState,
  (state: UsersState) => state.token
);