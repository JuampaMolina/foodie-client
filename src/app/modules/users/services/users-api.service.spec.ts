import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { User } from '../interface/user';
import { UserSession } from '../interface/UserSession';
import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpMock: HttpTestingController;

  const usersApi = environment.apiBaseUri + '/users';
  const user: User = {
    _id: '1',
    name: 'Ana',
    email: 'ana@test.com',
    role: 'user',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST to register a new user', () => {
    const command = { name: 'Ana', email: 'ana@test.com', password: 'secret' };
    service.registerUser(command).subscribe(result => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(usersApi + '/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(command);
    req.flush(user);
  });

  it('should POST to log in a user', () => {
    const command = { email: 'ana@test.com', password: 'secret' };
    const session: UserSession = { user, token: 'tok123' };
    service.loginUser(command).subscribe(result => {
      expect(result).toEqual(session);
    });

    const req = httpMock.expectOne(usersApi + '/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(command);
    req.flush(session);
  });

  it('should POST to request a password reset token', () => {
    const result = { token: 'reset-tok', warning: 'dev only' };
    service.forgotPassword('ana@test.com').subscribe(response => {
      expect(response).toEqual(result);
    });

    const req = httpMock.expectOne(usersApi + '/forgot-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'ana@test.com' });
    req.flush(result);
  });

  it('should POST to reset the password with a token', () => {
    service.resetPassword('reset-tok', 'newpass').subscribe();

    const req = httpMock.expectOne(usersApi + '/reset-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      token: 'reset-tok',
      password: 'newpass',
    });
    req.flush(null);
  });

  it('should GET a page of users', () => {
    const page = {
      items: [user],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };
    service.getUsers(1, 10).subscribe(result => {
      expect(result).toEqual(page);
    });

    const req = httpMock.expectOne(req => req.url === usersApi);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(page);
  });

  it('should PUT the new role of a user', () => {
    const updated: User = { ...user, role: 'admin' };
    service.updateUserRole({ userId: '1', role: 'admin' }).subscribe(result => {
      expect(result).toEqual(updated);
    });

    const req = httpMock.expectOne(usersApi + '/1/role');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ role: 'admin' });
    req.flush(updated);
  });
});
