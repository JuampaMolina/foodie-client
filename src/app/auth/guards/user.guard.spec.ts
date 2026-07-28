import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsUser } from '../../modules/users/store/users.selectors';
import { UserGuard } from './user.guard';

describe('UserGuard', () => {
  let guard: UserGuard;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        UserGuard,
        provideMockStore({
          selectors: [{ selector: selectIsUser, value: false }],
        }),
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(UserGuard);
    store = TestBed.inject(MockStore);
  });

  it('should allow access when the user is a "user"', done => {
    store.overrideSelector(selectIsUser, true);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to /login when there is no user', done => {
    store.overrideSelector(selectIsUser, false);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(result).not.toBeTrue();
      done();
    });
  });
});
