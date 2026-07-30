import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '../interface/item';
import { ItemCardComponent } from './item-card.component';

describe('ItemCardComponent', () => {
  let fixture: ComponentFixture<ItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
  });

  function getImage(): HTMLImageElement {
    return fixture.nativeElement.querySelector('img');
  }

  it('should render the placeholder image when the item has no image', () => {
    const item: Item = { _id: '1', name: 'Pizza', description: '', price: 10 };
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    expect(getImage().getAttribute('src')).toBe('assets/items/placeholder.svg');
  });

  it("should render the item's own image when set", () => {
    const item: Item = {
      _id: '1',
      name: 'Pizza',
      description: '',
      price: 10,
      image: 'assets/items/pizza.svg',
    };
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    expect(getImage().getAttribute('src')).toBe('assets/items/pizza.svg');
  });
});
