import { User } from './User';

export interface UsersState {
  user?: User;
  token?: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}
