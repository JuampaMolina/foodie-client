import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { selectCart } from '../../orders/store/orders.selectors';
import { selectCategories } from '../../categories/store/categories.selectors';
import { Item } from '../interface/item';
import { selectItems } from '../store/items.selectors';
import { ItemsComponent } from './items.component';

describe('ItemsComponent', () => {
  let fixture: ComponentFixture<ItemsComponent>;

  const items: Item[] = [
    { _id: '1', name: 'Pizza Margarita', description: '', price: 8 },
    { _id: '2', name: 'Ensalada César', description: '', price: 5 },
    { _id: '3', name: 'Hamburguesa Clásica', description: '', price: 5 },
  ];

  const setInputValue = (selector: string, value: string) => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const cardNames = (): string[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll('app-item-card .font-semibold')
    ).map((el: any) => el.textContent.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectItems, value: items },
            { selector: selectCategories, value: [] },
            { selector: selectCart, value: [] },
            { selector: selectIsAdmin, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    fixture.detectChanges();
  });

  it('should render every item when no filter is applied', () => {
    expect(cardNames().length).toBe(items.length);
  });

  it('should filter by name, ignoring accents and case', () => {
    setInputValue('input[type="text"]', 'cesar');
    expect(cardNames()).toEqual(['Ensalada César']);
  });

  it('should filter by minimum price', () => {
    setInputValue('input[placeholder="Precio mín."]', '6');
    expect(cardNames()).toEqual(['Pizza Margarita']);
  });

  it('should filter by maximum price', () => {
    setInputValue('input[placeholder="Precio máx."]', '5');
    expect(cardNames().sort()).toEqual(
      ['Ensalada César', 'Hamburguesa Clásica'].sort()
    );
  });

  it('should combine name and price filters', () => {
    setInputValue('input[type="text"]', 'ensalada');
    setInputValue('input[placeholder="Precio máx."]', '4');
    expect(cardNames()).toEqual([]);
  });

  it('should show a message when no item matches the filters', () => {
    setInputValue('input[type="text"]', 'no existe');
    expect(fixture.nativeElement.textContent).toContain(
      'No hay productos que coincidan con la búsqueda'
    );
  });
});
