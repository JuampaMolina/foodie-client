import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  template: `
    <form
      class="mx-auto flex w-2/3 items-center justify-center gap-4"
      [formGroup]="categoryForm"
      (ngSubmit)="onSubmit()">
      <label class="form-label" for="name">Nombre </label>
      <input
        class="form-input"
        id="name"
        type="text"
        placeholder="Nombre de la categoría"
        formControlName="name" />
      <button
        class="primary-button"
        type="submit"
        [disabled]="!categoryForm.valid">
        Enviar
      </button>
    </form>
  `,
  styles: [],
})
export class CategoryFormComponent {
  @Output() formValue = new EventEmitter<any>();

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor() {}

  onSubmit() {
    this.formValue.emit(this.categoryForm.value.name);
  }
}
