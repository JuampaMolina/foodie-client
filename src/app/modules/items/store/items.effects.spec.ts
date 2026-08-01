import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Item } from '../interface/item';
import { ItemsApiService } from '../services/items-api.service';
import { getItems, getItemsError, getItemsSuccess } from './items.actions';
import { ItemsEffects } from './items.effects';

describe('ItemsEffects', () => {
  let actions$: Observable<any>;
  let effects: ItemsEffects;
  let itemsApi: jasmine.SpyObj<ItemsApiService>;

  const item: Item = {
    _id: '1',
    name: 'Pizza Margarita',
    description: 'Tomate, mozzarella y albahaca fresca',
    price: 8,
  };
  const OFFLINE_CACHE_KEY = 'offline-cache:items';

  beforeEach(() => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);

    itemsApi = jasmine.createSpyObj('ItemsApiService', ['getItems']);

    TestBed.configureTestingModule({
      providers: [
        ItemsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ItemsApiService, useValue: itemsApi },
      ],
    });

    effects = TestBed.inject(ItemsEffects);
  });

  afterEach(() => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);
  });

  it('should dispatch getItemsSuccess when the API call succeeds', done => {
    itemsApi.getItems.and.returnValue(of([item]));
    actions$ = of(getItems());

    effects.getItems$.subscribe(action => {
      expect(action).toEqual(getItemsSuccess({ items: [item] }));
      done();
    });
  });

  it('caches the result in localStorage on success, for offline use', done => {
    itemsApi.getItems.and.returnValue(of([item]));
    actions$ = of(getItems());

    effects.getItems$.subscribe(() => {
      expect(JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY)!)).toEqual([
        item,
      ]);
      done();
    });
  });

  it('should dispatch getItemsError when the API call fails and there is no cache', done => {
    const error = { message: 'boom' };
    itemsApi.getItems.and.returnValue(throwError(() => error));
    actions$ = of(getItems());

    effects.getItems$.subscribe(action => {
      expect(action.type).toBe(getItemsError({ error }).type);
      done();
    });
  });

  it('falls back to the cached items when the API call fails offline', done => {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify([item]));
    itemsApi.getItems.and.returnValue(
      throwError(() => ({ message: 'network error' }))
    );
    actions$ = of(getItems());

    effects.getItems$.subscribe(action => {
      expect(action).toEqual(getItemsSuccess({ items: [item] }));
      done();
    });
  });
});
