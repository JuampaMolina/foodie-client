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

  it('should render the placeholder image when the item has no category image', () => {
    const item: Item = { _id: '1', name: 'Pizza', description: '', price: 10 };
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    expect(getImage().getAttribute('src')).toBe('assets/placeholder.svg');
  });

  it("should render the item's category image when set", () => {
    const item: Item = {
      _id: '1',
      name: 'Pizza',
      description: '',
      price: 10,
      category: {
        _id: 'c1',
        name: 'Pizzas',
        image: 'https://res.cloudinary.com/demo/image/upload/pizza.svg',
      },
    };
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    expect(getImage().getAttribute('src')).toBe(
      'https://res.cloudinary.com/demo/image/upload/pizza.svg'
    );
  });

  describe('editable quantity', () => {
    const item: Item = { _id: '1', name: 'Pizza', description: '', price: 10 };

    function getQuantityInput(): HTMLInputElement | null {
      return fixture.nativeElement.querySelector('input[type="number"]');
    }

    it('should not render a quantity input when modifyQuantity is false', () => {
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('quantity', 2);
      fixture.componentRef.setInput('modifyQuantity', false);
      fixture.detectChanges();

      expect(getQuantityInput()).toBeNull();
    });

    it('should render the current quantity in an editable input', () => {
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('quantity', 3);
      fixture.componentRef.setInput('modifyQuantity', true);
      fixture.detectChanges();

      expect(getQuantityInput()!.value).toBe('3');
    });

    it('should emit quantityChangeEvent with the typed quantity', () => {
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('quantity', 2);
      fixture.componentRef.setInput('modifyQuantity', true);
      fixture.detectChanges();

      const emitted: number[] = [];
      fixture.componentInstance.quantityChangeEvent.subscribe(quantity =>
        emitted.push(quantity)
      );

      const input = getQuantityInput()!;
      input.value = '5';
      input.dispatchEvent(new Event('change'));

      expect(emitted).toEqual([5]);
    });

    it('should clamp negative or invalid input to 0', () => {
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('quantity', 2);
      fixture.componentRef.setInput('modifyQuantity', true);
      fixture.detectChanges();

      const emitted: number[] = [];
      fixture.componentInstance.quantityChangeEvent.subscribe(quantity =>
        emitted.push(quantity)
      );

      const input = getQuantityInput()!;
      input.value = '-3';
      input.dispatchEvent(new Event('change'));

      expect(emitted).toEqual([0]);
    });
  });
});
