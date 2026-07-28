import { User } from './user';

export interface UserSession {
  user: User;
  token: string;
}
