import { User } from '../interface/user';
import {
  loginUser,
  loginUserError,
  loginUserSuccess,
  logoutUser,
  registerUser,
  restoreUserSession,
  registerUserSuccess,
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
import { usersInitialState, usersReducer } from './users.reducer';

describe('usersReducer', () => {
  const user: User = {
    _id: '1',
    name: 'Ana',
    email: 'ana@test.com',
    role: 'user',
  };

  it('should return the initial state for an unknown action', () => {
    const state = usersReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(usersInitialState);
  });

  it('should set loading on loginUser', () => {
    const state = usersReducer(
      usersInitialState,
      loginUser({ user: { email: 'ana@test.com', password: 'secret' } })
    );
    expect(state.loading).toBeTrue();
  });

  it('should set the error message on loginUserError', () => {
    const state = usersReducer(
      usersInitialState,
      loginUserError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should store the user and token on loginUserSuccess', () => {
    const state = usersReducer(
      usersInitialState,
      loginUserSuccess({ userSession: { user, token: 'tok' } })
    );
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok');
    expect(state.loaded).toBeTrue();
  });

  it('should store the user and token on restoreUserSession, same as loginUserSuccess', () => {
    const state = usersReducer(
      usersInitialState,
      restoreUserSession({ userSession: { user, token: 'tok' } })
    );
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok');
    expect(state.loaded).toBeTrue();
  });

  it('should set loading on registerUser', () => {
    const state = usersReducer(
      usersInitialState,
      registerUser({
        user: { name: 'Ana', email: 'ana@test.com', password: 'secret' },
      })
    );
    expect(state.loading).toBeTrue();
  });

  it('should mark loaded on registerUserSuccess', () => {
    const state = usersReducer(
      usersInitialState,
      registerUserSuccess({ user })
    );
    expect(state.loaded).toBeTrue();
  });

  it('should clear the user and token on logoutUser', () => {
    const state = usersReducer(
      { ...usersInitialState, user, token: 'tok' },
      logoutUser()
    );
    expect(state.user).toBeUndefined();
    expect(state.token).toBeUndefined();
  });

  it('should set the error message on forgotPasswordError', () => {
    const state = usersReducer(
      usersInitialState,
      forgotPasswordError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should store the reset token on forgotPasswordSuccess', () => {
    const state = usersReducer(
      usersInitialState,
      forgotPasswordSuccess({ token: 'reset-tok' })
    );
    expect(state.resetToken).toBe('reset-tok');
  });

  it('should clear a previous reset token on forgotPassword', () => {
    const state = usersReducer(
      { ...usersInitialState, resetToken: 'old-tok' },
      forgotPassword({ email: 'ana@test.com' })
    );
    expect(state.resetToken).toBeUndefined();
  });

  it('should set the error message on resetPasswordError', () => {
    const state = usersReducer(
      usersInitialState,
      resetPasswordError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should mark resetPasswordDone on resetPasswordSuccess', () => {
    const state = usersReducer(usersInitialState, resetPasswordSuccess());
    expect(state.resetPasswordDone).toBeTrue();
  });

  it('should reset resetPasswordDone on resetPassword', () => {
    const state = usersReducer(
      { ...usersInitialState, resetPasswordDone: true },
      resetPassword({ token: 'reset-tok', password: 'newpass' })
    );
    expect(state.resetPasswordDone).toBeFalse();
  });

  it('should set loading on getUsers', () => {
    const state = usersReducer(usersInitialState, getUsers({}));
    expect(state.adminUsersLoading).toBeTrue();
  });

  it('should set the error message on getUsersError', () => {
    const state = usersReducer(
      usersInitialState,
      getUsersError({ error: { message: 'boom' } })
    );
    expect(state.adminUsersError).toBe('boom');
  });

  it('should populate admin users and pagination metadata on getUsersSuccess', () => {
    const state = usersReducer(
      usersInitialState,
      getUsersSuccess({ users: [user], page: 2, total: 15, totalPages: 2 })
    );
    expect(state.adminUsers).toEqual([user]);
    expect(state.adminUsersPage).toBe(2);
    expect(state.adminUsersTotal).toBe(15);
    expect(state.adminUsersTotalPages).toBe(2);
  });

  it('should set the error message on updateUserRoleError', () => {
    const state = usersReducer(
      usersInitialState,
      updateUserRoleError({ error: { message: 'boom' } })
    );
    expect(state.adminUsersError).toBe('boom');
  });

  it('should update the matching admin user on updateUserRoleSuccess', () => {
    const updated: User = { ...user, role: 'admin' };
    const state = usersReducer(
      { ...usersInitialState, adminUsers: [user] },
      updateUserRoleSuccess({ user: updated })
    );
    expect(state.adminUsers).toEqual([updated]);
  });
});
