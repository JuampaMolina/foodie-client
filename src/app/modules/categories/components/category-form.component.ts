import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../interface/category';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';

interface StockImage {
  name: string;
  path: string;
}

const STOCK_IMAGES: StockImage[] = [
  { name: 'Pizza', path: 'assets/categories/pizza.svg' },
  { name: 'Hamburguesa', path: 'assets/categories/burger.svg' },
  { name: 'Patatas fritas', path: 'assets/categories/fries.svg' },
  { name: 'Bebida', path: 'assets/categories/drink.svg' },
  { name: 'Postre', path: 'assets/categories/dessert.svg' },
  { name: 'Ensalada', path: 'assets/categories/salad.svg' },
  { name: 'Pasta', path: 'assets/categories/pasta.svg' },
  { name: 'Sushi', path: 'assets/categories/sushi.svg' },
];

@Component({
  selector: 'app-category-form',
  template: `
    <form
      class="mx-auto flex w-2/3 flex-col items-center justify-center gap-4"
      [formGroup]="categoryForm">
      <div class="flex w-full items-center justify-center gap-4">
        <label class="form-label" for="name">Nombre </label>
        <input
          class="form-input"
          id="name"
          type="text"
          placeholder="Nombre de la categoría"
          formControlName="name" />
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        @for (stockImage of stockImages; track stockImage.path) {
        <img
          [src]="stockImage.path"
          [alt]="stockImage.name"
          [title]="stockImage.name"
          (click)="selectImage(stockImage.path)"
          class="h-14 w-14 cursor-pointer rounded border-2 object-cover"
          [class.border-slate-800]="
            categoryForm.value.image === stockImage.path
          "
          [class.border-transparent]="
            categoryForm.value.image !== stockImage.path
          " />
        }
      </div>

      @if (!updating) {
      <button
        (click)="create()"
        class="primary-button"
        type="button"
        [disabled]="!categoryForm.valid">
        Enviar
      </button>
      } @if (updating) {
      <div class="mx-auto flex space-x-4">
        <button
          (click)="delete()"
          class="secondary-button"
          type="button"
          [disabled]="!categoryId">
          Eliminar
        </button>
        <button
          (click)="update()"
          class="primary-button"
          type="button"
          [disabled]="!categoryForm.valid">
          Modificar
        </button>
      </div>
      }
    </form>
  `,
  styles: [],
  imports: [ReactiveFormsModule],
})
export class CategoryFormComponent {
  @Input() set modify(category: Category | undefined) {
    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
        image: category.image ?? '',
      });
      this.updating = true;
      this.categoryId = category._id;
    }
  }

  @Input() set reset(reset: boolean) {
    if (reset) {
      this.categoryForm.reset();
    }
  }

  @Output() createEvent = new EventEmitter<CreateCategoryCommand>();
  @Output() updateEvent = new EventEmitter<UpdateCategoryCommand>();
  @Output() deleteEvent = new EventEmitter<string>();
  updating: boolean = false;
  categoryId: string = '';

  readonly stockImages = STOCK_IMAGES;

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(''),
  });

  constructor() {}

  selectImage(path: string) {
    const current = this.categoryForm.value.image;
    this.categoryForm.patchValue({ image: current === path ? '' : path });
  }

  create() {
    const { name, image } = this.categoryForm.value;
    const category: CreateCategoryCommand = {
      name: name!,
      image: image || undefined,
    };
    this.createEvent.emit(category);
    this.categoryForm.reset();
  }

  update() {
    const { name, image } = this.categoryForm.value;
    const category: CreateCategoryCommand = {
      name: name!,
      image: image || undefined,
    };
    this.updateEvent.emit({ categoryId: this.categoryId, category });
    this.categoryForm.reset();
    this.updating = false;
    this.categoryId = '';
  }

  delete() {
    this.deleteEvent.emit(this.categoryId);
    this.categoryForm.reset();
    this.updating = false;
    this.categoryId = '';
  }
}
