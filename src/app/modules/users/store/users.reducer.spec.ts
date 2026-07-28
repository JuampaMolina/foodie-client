import { User } from '../interface/user';
import {
  loginUser,
  loginUserError,
  loginUserSuccess,
  logoutUser,
  registerUser,
  registerUserSuccess,
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
});
