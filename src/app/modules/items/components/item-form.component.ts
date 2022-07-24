import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Item } from '../interface/item';
import { CreateItemCommand } from '../interface/createItemCommand';

@Component({
  selector: 'app-item-form',
  template: `
    <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">

      <label for="name">Nombre: </label>
      <input id="name" type="text" formControlName="name">

      <label for="description">Descripción: </label>
      <input id="description" type="text" formControlName="description">

      <label for="category">Categoría: </label>
      <input id="category" type="text" formControlName="category">

      <label for="price">Precio:</label>
      <input id="price" type="number" formControlName="price">

      <button  class="" type="submit" [disabled]="!itemForm.valid">Enviar</button>
    </form>

  `,
  styles: [
  ]
})
export class ItemFormComponent implements OnInit {

  @Output() formValue = new EventEmitter<any>;

  itemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(undefined, Validators.required)
  })

  constructor() { }

  onSubmit() {
    this.formValue.emit(this.itemForm.value);
  }

  ngOnInit(): void {
  }

}
