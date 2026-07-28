import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { CategoriesModule } from '../categories.module';
import { Category } from '../interface/category';
import { selectCategories } from '../store/categories.selectors';
import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
  let fixture: ComponentFixture<CategoriesComponent>;
  let store: MockStore;

  const categories: Category[] = [
    { _id: '1', name: 'Bebidas' },
    { _id: '2', name: 'Postres' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectCategories, value: categories },
            { selector: selectIsAdmin, value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CategoriesComponent);
    fixture.detectChanges();
  });

  it('should render one category card per category in the store', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-category-card');
    expect(cards.length).toBe(categories.length);
  });

  it('should not show the "add category" button for non-admins', () => {
    expect(fixture.nativeElement.querySelector('.primary-button')).toBeNull();
  });

  it('should show the "add category" button for admins', () => {
    store.overrideSelector(selectIsAdmin, true);
    store.refreshState();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.primary-button')
    ).not.toBeNull();
  });
});
