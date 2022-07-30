import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from '../../categories/interface/category';

@Component({
  selector: 'app-item-form',
  template: `
    <form
      class="grid grid-cols-3 gap-4"
      [formGroup]="itemForm"
      (ngSubmit)="onSubmit()">
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
          formControlName="categoryId">
          <option
            *ngFor="let category of categories"
            value="{{ category._id }}">
            {{ category.name }}
          </option>
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

      <button
        class="primary-button col-start-2"
        type="submit"
        [disabled]="!itemForm.valid">
        Enviar
      </button>
    </form>
  `,
  styles: [],
})
export class ItemFormComponent {
  @Input() categories: Category[] = [];
  @Output() formValue = new EventEmitter<any>();

  itemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(undefined, Validators.required),
  });

  constructor() {}

  onSubmit() {
    this.formValue.emit(this.itemForm.value);
  }
}
