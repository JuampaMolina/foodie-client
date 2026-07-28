import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsAuthenticated } from '../../modules/users/store/users.selectors';
import { AuthenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthenticatedGuard,
        provideMockStore({
          selectors: [{ selector: selectIsAuthenticated, value: false }],
        }),
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthenticatedGuard);
    store = TestBed.inject(MockStore);
  });

  it('should allow access when authenticated', done => {
    store.overrideSelector(selectIsAuthenticated, true);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to /login when not authenticated', done => {
    store.overrideSelector(selectIsAuthenticated, false);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(result).not.toBeTrue();
      done();
    });
  });
});
