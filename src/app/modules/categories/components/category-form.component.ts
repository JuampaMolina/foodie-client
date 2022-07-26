import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  template: `
    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
      <label for="name">Nombre: </label>
      <input id="name" type="text" formControlName="name" />

      <button class="" type="submit" [disabled]="!categoryForm.valid">
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
    this.formValue.emit(this.categoryForm.value);
  }
}
