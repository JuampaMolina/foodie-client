import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../interface/category';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';
import { CategoryImageUploadService } from '../services/category-image-upload.service';

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
          class="h-14 w-14 cursor-pointer rounded-xl border-2 object-cover transition"
          [class.border-brand-600]="
            categoryForm.value.image === stockImage.path
          "
          [class.bg-brand-50]="categoryForm.value.image === stockImage.path"
          [class.border-transparent]="
            categoryForm.value.image !== stockImage.path
          " />
        } @if (customImagePreview()) {
        <img
          [src]="customImagePreview()"
          alt="Icono personalizado"
          title="Icono personalizado"
          class="h-14 w-14 rounded-xl border-2 border-brand-600 bg-brand-50 object-cover" />
        }
        <label
          class="flex h-14 w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-400 transition hover:border-brand-500 hover:text-brand-600 dark:border-neutral-700 dark:text-neutral-500"
          title="Subir icono propio">
          @if (uploading()) {
          <i class="fa-solid fa-spinner fa-spin"></i>
          } @else {
          <i class="fa-solid fa-upload"></i>
          <span class="text-[10px] font-semibold">Subir</span>
          }
          <input
            type="file"
            accept="image/*"
            class="hidden"
            [disabled]="uploading()"
            (change)="onFileSelected($event)" />
        </label>
      </div>
      @if (uploadError()) {
      <p class="text-sm text-red-600">{{ uploadError() }}</p>
      } @if (!updating) {
      <button
        (click)="create()"
        class="primary-button"
        type="button"
        [disabled]="!categoryForm.valid || uploading()">
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
          [disabled]="!categoryForm.valid || uploading()">
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
  private uploadService = inject(CategoryImageUploadService);

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
      this.uploading.set(false);
      this.uploadError.set('');
    }
  }

  @Output() createEvent = new EventEmitter<CreateCategoryCommand>();
  @Output() updateEvent = new EventEmitter<UpdateCategoryCommand>();
  @Output() deleteEvent = new EventEmitter<string>();
  updating: boolean = false;
  categoryId: string = '';

  readonly stockImages = STOCK_IMAGES;

  uploading = signal(false);
  uploadError = signal('');

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(''),
  });

  constructor() {}

  customImagePreview(): string | null {
    const image = this.categoryForm.value.image;
    if (!image) {
      return null;
    }
    return this.stockImages.some(stockImage => stockImage.path === image)
      ? null
      : image;
  }

  selectImage(path: string) {
    const current = this.categoryForm.value.image;
    this.categoryForm.patchValue({ image: current === path ? '' : path });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.uploadError.set('');

    this.uploadService.upload(file).subscribe({
      next: url => {
        this.categoryForm.patchValue({ image: url });
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.uploadError.set('No se pudo subir la imagen. Inténtalo de nuevo.');
        this.uploading.set(false);
        input.value = '';
      },
    });
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
