import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../interface/User';
import { UserSession } from '../interface/UserSession';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { LoginUserCommand } from '../interface/LoginUserCommand';

const usersApi = environment.apiBaseUri + '/users';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private http: HttpClient) {}

  registerUser(user: RegisterUserCommand): Observable<User> {
    return this.http.post<User>(usersApi + '/register', user);
  }

  loginUser(user: LoginUserCommand): Observable<UserSession> {
    return this.http.post<UserSession>(usersApi + '/login', user);
  }
}
