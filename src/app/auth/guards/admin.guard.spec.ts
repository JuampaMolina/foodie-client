import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsAdmin } from '../../modules/users/store/users.selectors';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: selectIsAdmin, value: false }],
        }),
        { provide: Router, useValue: router },
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should allow access for admins', done => {
    store.overrideSelector(selectIsAdmin, true);
    const result$ = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    ) as any;
    result$.subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to / for non-admins', done => {
    store.overrideSelector(selectIsAdmin, false);
    const result$ = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    ) as any;
    result$.subscribe((result: boolean | UrlTree) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
      expect(result).not.toBeTrue();
      done();
    });
  });
});
