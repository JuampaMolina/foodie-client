import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Item } from '../modules/items/interface/item';
import { selectItems } from '../modules/items/store/items.selectors';
import { selectCart } from '../modules/orders/store/orders.selectors';
import { getTopItems } from '../modules/metrics/store/metrics.actions';
import { selectTopItems } from '../modules/metrics/store/metrics.selectors';
import { TopItem } from '../modules/metrics/interface/topItem';
import { FeaturedItemsComponent } from './featured-items.component';

describe('FeaturedItemsComponent', () => {
  let fixture: ComponentFixture<FeaturedItemsComponent>;
  let store: MockStore;

  const items: Item[] = [
    { _id: '1', name: 'Pizza Margarita', description: '', price: 8 },
    { _id: '2', name: 'Ensalada César', description: '', price: 5 },
  ];
  const topItems: TopItem[] = [
    { itemId: '2', name: 'Ensalada César', quantity: 40 },
    { itemId: '1', name: 'Pizza Margarita', quantity: 12 },
    { itemId: 'discontinued', name: 'Sopa de temporada', quantity: 3 },
  ];

  const cardNames = (): string[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll(
        'app-item-card .font-semibold.text-neutral-900'
      )
    ).map((el: any) => el.textContent.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedItemsComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectTopItems, value: topItems },
            { selector: selectItems, value: items },
            { selector: selectCart, value: [] },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(FeaturedItemsComponent);
    fixture.detectChanges();
  });

  it('dispatches getTopItems on init', () => {
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(FeaturedItemsComponent);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(getTopItems({ limit: 8 }));
  });

  it('shows featured items in top-items order, using the full catalog data', () => {
    expect(cardNames()).toEqual(['Ensalada César', 'Pizza Margarita']);
  });

  it('skips top items that no longer exist in the catalog', () => {
    expect(cardNames()).not.toContain('Sopa de temporada');
  });

  it('renders nothing when there are no featured items yet', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [FeaturedItemsComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectTopItems, value: [] },
              { selector: selectItems, value: items },
              { selector: selectCart, value: [] },
            ],
          }),
        ],
      })
      .compileComponents();

    const emptyFixture = TestBed.createComponent(FeaturedItemsComponent);
    emptyFixture.detectChanges();

    expect(
      emptyFixture.nativeElement.querySelectorAll('app-item-card').length
    ).toBe(0);
  });
});
