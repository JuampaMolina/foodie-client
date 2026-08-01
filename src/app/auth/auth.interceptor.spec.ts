import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../environments/environment';
import { selectToken } from '../modules/users/store/users.selectors';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function setup(token?: string) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [{ selector: selectToken, value: token }],
        }),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpMock.verify());

  it('should attach the Authorization header when a token is present', () => {
    setup('tok123');

    http.get(`${environment.apiBaseUri}/categories`).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUri}/categories`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok123');
    req.flush([]);
  });

  it('should not attach an Authorization header when there is no token', () => {
    setup(undefined);

    http.get(`${environment.apiBaseUri}/categories`).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUri}/categories`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('should not attach the token to requests outside our own API (e.g. Cloudinary)', () => {
    // Regresión: el interceptor adjuntaba el JWT a cualquier petición HTTP,
    // sin mirar el dominio — se filtraría a servicios de terceros como
    // Cloudinary en la subida directa de imágenes de categoría.
    setup('tok123');

    http
      .post('https://api.cloudinary.com/v1_1/demo/image/upload', {})
      .subscribe();

    const req = httpMock.expectOne(
      'https://api.cloudinary.com/v1_1/demo/image/upload'
    );
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
