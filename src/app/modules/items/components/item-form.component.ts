import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from '../../categories/interface/category';
import { Item } from '../interface/item';

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
          <option *ngFor="let category of categories" [ngValue]="category">
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

      <!-- mejor dos botones, tipo button, uno llama create y otro modify -->
      <button
        *ngIf="!updating"
        (click)="create()"
        class="primary-button col-start-2"
        type="button"
        [disabled]="!itemForm.valid">
        Enviar
      </button>
      <div *ngIf="updating" class="col-span-3 mx-auto flex space-x-4">
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
    </form>
  `,
  styles: [],
})
export class ItemFormComponent {
  @Input() set modify(item: Item | undefined) {
    if (item) {
      this.itemForm.patchValue({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
      });
      this.updating = true;
      this.itemId = item._id;
    }
  }

  @Input() categories: Category[] = [];
  @Output() createEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  updating: boolean = false;
  itemId: string = '';

  itemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl(this.categories[0], Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(NaN, Validators.required),
  });

  constructor() {}

  compareFn(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }

  create() {
    this.createEvent.emit(this.itemForm.value);
    this.itemForm.reset();
  }

  update() {
    this.updateEvent.emit({ itemId: this.itemId, item: this.itemForm.value });
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
