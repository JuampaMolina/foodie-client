import { UserRole } from './user';

export interface UpdateUserRoleCommand {
  userId: string;
  role: UserRole;
}
