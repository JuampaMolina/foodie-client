import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { User } from '../interface/User';
import { UserSession } from '../interface/UserSession';

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
