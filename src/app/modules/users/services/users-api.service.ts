import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../orders/interface/paginatedResult';
import { ForgotPasswordResult } from '../interface/ForgotPasswordResult';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { UpdateUserRoleCommand } from '../interface/updateUserRoleCommand';
import { User } from '../interface/user';
import { UserSession } from '../interface/UserSession';

const usersApi = environment.apiBaseUri + '/users';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private http = inject(HttpClient);

  registerUser(user: RegisterUserCommand): Observable<User> {
    return this.http.post<User>(usersApi + '/register', user);
  }

  loginUser(user: LoginUserCommand): Observable<UserSession> {
    return this.http.post<UserSession>(usersApi + '/login', user);
  }

  forgotPassword(email: string): Observable<ForgotPasswordResult> {
    return this.http.post<ForgotPasswordResult>(usersApi + '/forgot-password', {
      email,
    });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(usersApi + '/reset-password', {
      token,
      password,
    });
  }

  getUsers(page: number, limit: number): Observable<PaginatedResult<User>> {
    return this.http.get<PaginatedResult<User>>(usersApi, {
      params: { page, limit },
    });
  }

  updateUserRole(roleUpdate: UpdateUserRoleCommand): Observable<User> {
    const { userId, role } = roleUpdate;
    return this.http.put<User>(usersApi + `/${userId}/role`, { role });
  }
}
