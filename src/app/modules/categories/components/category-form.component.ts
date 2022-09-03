import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../interface/category';

@Component({
  selector: 'app-category-form',
  template: `
    <form
      class="mx-auto flex w-2/3 items-center justify-center gap-4"
      [formGroup]="categoryForm">
      <label class="form-label" for="name">Nombre </label>
      <input
        class="form-input"
        id="name"
        type="text"
        placeholder="Nombre de la categoría"
        formControlName="name" />

      <button
        *ngIf="!updating"
        (click)="create()"
        class="primary-button col-start-2"
        type="button"
        [disabled]="!categoryForm.valid">
        Enviar
      </button>
      <div *ngIf="updating" class="col-span-3 mx-auto flex space-x-4">
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
    </form>
  `,
  styles: [],
})
export class CategoryFormComponent {
  @Input() set modify(category: Category | undefined) {
    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
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

  @Output() createEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  updating: boolean = false;
  categoryId: string = '';

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor() {}

  create() {
    this.createEvent.emit(this.categoryForm.value);
    this.categoryForm.reset();
  }

  update() {
    this.updateEvent.emit({
      categoryId: this.categoryId,
      category: this.categoryForm.value,
    });
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
