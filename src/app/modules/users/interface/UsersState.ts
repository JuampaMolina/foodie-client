import { User } from './user';

export interface UsersState {
  user?: User;
  token?: string;
  loading: boolean;
  loaded: boolean;
  error: any;
  resetToken?: string;
  resetPasswordDone: boolean;
  adminUsers: User[];
  adminUsersLoading: boolean;
  adminUsersError: any;
  adminUsersPage: number;
  adminUsersTotal: number;
  adminUsersTotalPages: number;
}
