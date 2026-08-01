import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Category } from '../interface/category';
import { CategoriesApiService } from '../services/categories-api.service';
import {
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
} from './categories.actions';
import { CategoriesEffects } from './categories.effects';

describe('CategoriesEffects', () => {
  let actions$: Observable<any>;
  let effects: CategoriesEffects;
  let categoriesApi: jasmine.SpyObj<CategoriesApiService>;

  const category: Category = { _id: '1', name: 'Bebidas' };
  const OFFLINE_CACHE_KEY = 'offline-cache:categories';

  beforeEach(() => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);

    categoriesApi = jasmine.createSpyObj('CategoriesApiService', [
      'getCategories',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CategoriesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: CategoriesApiService, useValue: categoriesApi },
      ],
    });

    effects = TestBed.inject(CategoriesEffects);
  });

  afterEach(() => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);
  });

  it('should dispatch getCategoriesSuccess when the API call succeeds', done => {
    categoriesApi.getCategories.and.returnValue(of([category]));
    actions$ = of(getCategories());

    effects.getCategories$.subscribe(action => {
      expect(action).toEqual(getCategoriesSuccess({ categories: [category] }));
      done();
    });
  });

  it('caches the result in localStorage on success, for offline use', done => {
    categoriesApi.getCategories.and.returnValue(of([category]));
    actions$ = of(getCategories());

    effects.getCategories$.subscribe(() => {
      expect(JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY)!)).toEqual([
        category,
      ]);
      done();
    });
  });

  it('should dispatch getCategoriesError when the API call fails and there is no cache', done => {
    const error = { message: 'boom' };
    categoriesApi.getCategories.and.returnValue(throwError(() => error));
    actions$ = of(getCategories());

    effects.getCategories$.subscribe(action => {
      expect(action.type).toBe(getCategoriesError({ error }).type);
      done();
    });
  });

  it('falls back to the cached categories when the API call fails offline', done => {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify([category]));
    categoriesApi.getCategories.and.returnValue(
      throwError(() => ({ message: 'network error' }))
    );
    actions$ = of(getCategories());

    effects.getCategories$.subscribe(action => {
      expect(action).toEqual(getCategoriesSuccess({ categories: [category] }));
      done();
    });
  });
});
