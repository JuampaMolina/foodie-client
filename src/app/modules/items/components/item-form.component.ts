import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../../categories/interface/category';
import { CreateItemCommand } from '../interface/createItemCommand';
import { Item } from '../interface/item';
import { UpdateItemCommand } from '../interface/updateItemCommand';

interface StockImage {
  name: string;
  path: string;
}

const STOCK_IMAGES: StockImage[] = [
  { name: 'Pizza', path: 'assets/items/pizza.svg' },
  { name: 'Hamburguesa', path: 'assets/items/burger.svg' },
  { name: 'Patatas fritas', path: 'assets/items/fries.svg' },
  { name: 'Bebida', path: 'assets/items/drink.svg' },
  { name: 'Postre', path: 'assets/items/dessert.svg' },
  { name: 'Ensalada', path: 'assets/items/salad.svg' },
  { name: 'Pasta', path: 'assets/items/pasta.svg' },
  { name: 'Sushi', path: 'assets/items/sushi.svg' },
];

@Component({
  selector: 'app-item-form',
  template: `
    <form class="grid grid-cols-3 gap-4" [formGroup]="itemForm">
      <div>
        <label class="form-label mb-1" for="name">Nombre </label>
        <input
          placeholder="Nombre"
          class="form-input"
          id="name"
          type="text"
          formControlName="name" />
      </div>

      <div>
        <label class="form-label mb-1" for="price">Precio</label>
        <input
          placeholder="Precio en EUR"
          class="form-input"
          id="price"
          type="number"
          formControlName="price" />
      </div>

      <div>
        <label class="form-label mb-1" for="category">Categoría </label>
        <select
          class="select-background form-input cursor-pointer"
          name="category"
          id="category"
          [compareWith]="compareFn"
          formControlName="category">
          @for (category of categories; track category) {
          <option [ngValue]="category">
            {{ category.name }}
          </option>
          }
        </select>
      </div>

      <div class="col-span-3">
        <label class="form-label mb-1" for="description">Descripción </label>
        <textarea
          placeholder="Descripción del producto"
          class="form-input resize-none"
          name="description"
          id="description"
          formControlName="description"></textarea>
      </div>

      <div class="col-span-3">
        <label class="form-label mb-1">Imagen</label>
        <div class="flex flex-wrap gap-2">
          @for (stockImage of stockImages; track stockImage.path) {
          <img
            [src]="stockImage.path"
            [alt]="stockImage.name"
            [title]="stockImage.name"
            (click)="selectImage(stockImage.path)"
            class="h-14 w-14 cursor-pointer rounded border-2 object-cover"
            [class.border-slate-800]="itemForm.value.image === stockImage.path"
            [class.border-transparent]="
              itemForm.value.image !== stockImage.path
            " />
          }
        </div>
      </div>

      @if (!updating) {
      <button
        (click)="create()"
        class="primary-button col-start-2"
        type="button"
        [disabled]="!itemForm.valid">
        Enviar
      </button>
      } @if (updating) {
      <div class="col-span-3 mx-auto flex space-x-4">
        <button
          (click)="delete()"
          class="secondary-button"
          type="button"
          [disabled]="!itemId">
          Eliminar
        </button>
        <button
          (click)="update()"
          class="primary-button"
          type="button"
          [disabled]="!itemForm.valid">
          Modificar
        </button>
      </div>
      }
    </form>
  `,
  styles: [],
  imports: [ReactiveFormsModule],
})
export class ItemFormComponent {
  @Input() set modify(item: Item | undefined) {
    if (item) {
      this.itemForm.patchValue({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image ?? '',
      });
      this.updating = true;
      this.itemId = item._id;
    }
  }

  @Input() set reset(reset: boolean) {
    if (reset) {
      this.itemForm.reset();
    }
  }

  @Input() categories: Category[] = [];
  @Output() createEvent = new EventEmitter<CreateItemCommand>();
  @Output() updateEvent = new EventEmitter<UpdateItemCommand>();
  @Output() deleteEvent = new EventEmitter<string>();
  updating: boolean = false;
  itemId: string = '';

  readonly stockImages = STOCK_IMAGES;

  itemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl(this.categories[0], Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(NaN, Validators.required),
    image: new FormControl(''),
  });

  constructor() {}

  compareFn(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }

  selectImage(path: string) {
    const current = this.itemForm.value.image;
    this.itemForm.patchValue({ image: current === path ? '' : path });
  }

  create() {
    const { name, category, description, price, image } = this.itemForm.value;
    const form: CreateItemCommand = {
      name: name!,
      category: category?._id!,
      description: description!,
      price: price!,
      image: image || undefined,
    };
    this.createEvent.emit(form);
    this.itemForm.reset();
  }

  update() {
    const { name, category, description, price, image } = this.itemForm.value;
    const form: CreateItemCommand = {
      name: name!,
      category: category?._id!,
      description: description!,
      price: price!,
      image: image || undefined,
    };
    this.updateEvent.emit({ itemId: this.itemId, item: form });
    this.itemForm.reset();
    this.updating = false;
    this.itemId = '';
  }

  delete() {
    this.deleteEvent.emit(this.itemId);
    this.itemForm.reset();
    this.updating = false;
    this.itemId = '';
  }

  onSubmit() {
    console.log(this.itemForm.value);
    // this.formValue.emit(this.itemForm.value);
  }
}
