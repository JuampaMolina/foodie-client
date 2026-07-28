import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsAuthenticated } from '../../modules/users/store/users.selectors';
import { authenticatedGuard } from './authenticated.guard';

describe('authenticatedGuard', () => {
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: selectIsAuthenticated, value: false }],
        }),
        { provide: Router, useValue: router },
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should allow access when authenticated', done => {
    store.overrideSelector(selectIsAuthenticated, true);
    const result$ = TestBed.runInInjectionContext(() =>
      authenticatedGuard({} as any, {} as any)
    ) as any;
    result$.subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to /login when not authenticated', done => {
    store.overrideSelector(selectIsAuthenticated, false);
    const result$ = TestBed.runInInjectionContext(() =>
      authenticatedGuard({} as any, {} as any)
    ) as any;
    result$.subscribe((result: boolean | UrlTree) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(result).not.toBeTrue();
      done();
    });
  });
});
