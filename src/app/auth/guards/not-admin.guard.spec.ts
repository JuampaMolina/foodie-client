import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsAdmin } from '../../modules/users/store/users.selectors';
import { NotAdminGuard } from './not-admin.guard';

describe('NotAdminGuard', () => {
  let guard: NotAdminGuard;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        NotAdminGuard,
        provideMockStore({
          selectors: [{ selector: selectIsAdmin, value: false }],
        }),
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(NotAdminGuard);
    store = TestBed.inject(MockStore);
  });

  it('should allow access for non-admins', done => {
    store.overrideSelector(selectIsAdmin, false);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect admins to /admin', done => {
    store.overrideSelector(selectIsAdmin, true);
    (guard.canActivate() as any).subscribe((result: boolean | UrlTree) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/admin']);
      expect(result).not.toBeTrue();
      done();
    });
  });
});
