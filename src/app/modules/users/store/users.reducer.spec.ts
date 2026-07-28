import { User } from '../interface/user';
import {
  loginUser,
  loginUserError,
  loginUserSuccess,
  logoutUser,
  registerUser,
  registerUserSuccess,
} from './users.actions';
// NOTE: `ordersInitalState` is a pre-existing copy-paste typo in users.reducer.ts
// (should be `usersInitialState`) — it's fixed in a later commit, at which point
// this import (and only this import) needs updating to match.
import {
  ordersInitalState as usersInitalState,
  usersReducer,
} from './users.reducer';

describe('usersReducer', () => {
  const user: User = {
    _id: '1',
    name: 'Ana',
    email: 'ana@test.com',
    role: 'user',
  };

  it('should return the initial state for an unknown action', () => {
    const state = usersReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(usersInitalState);
  });

  it('should set loading on loginUser', () => {
    const state = usersReducer(
      usersInitalState,
      loginUser({ user: { email: 'ana@test.com', password: 'secret' } })
    );
    expect(state.loading).toBeTrue();
  });

  it('should set the error message on loginUserError', () => {
    const state = usersReducer(
      usersInitalState,
      loginUserError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should store the user and token on loginUserSuccess', () => {
    const state = usersReducer(
      usersInitalState,
      loginUserSuccess({ userSession: { user, token: 'tok' } })
    );
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok');
    expect(state.loaded).toBeTrue();
  });

  it('should set loading on registerUser', () => {
    const state = usersReducer(
      usersInitalState,
      registerUser({
        user: { name: 'Ana', email: 'ana@test.com', password: 'secret' },
      })
    );
    expect(state.loading).toBeTrue();
  });

  it('should mark loaded on registerUserSuccess', () => {
    const state = usersReducer(usersInitalState, registerUserSuccess({ user }));
    expect(state.loaded).toBeTrue();
  });

  it('should clear the user and token on logoutUser', () => {
    const state = usersReducer(
      { ...usersInitalState, user, token: 'tok' },
      logoutUser()
    );
    expect(state.user).toBeUndefined();
    expect(state.token).toBeUndefined();
  });
});
