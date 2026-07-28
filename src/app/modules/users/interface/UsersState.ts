import { User } from './user';

export interface UsersState {
  user?: User;
  token?: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}
