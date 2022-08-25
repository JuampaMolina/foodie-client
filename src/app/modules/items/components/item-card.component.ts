import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Item } from '../interface/item';

@Component({
  selector: 'app-item-card',
  template: `
    <div
      *ngIf="item"
      class="flex h-32 flex-col rounded bg-slate-200 p-4 text-slate-800">
      <div class="space-x-2">
        <span class="font-semibold">{{ item.name }}</span>
        <span class="text-xs font-extralight">{{ item.category?.name }}</span>
      </div>
      <span class="grow font-light">{{ item.description }}</span>
      <span class="flex items-center justify-between">
        <span class="">{{ item.price }} EUR</span>
        <span
          *ngIf="!isAdmin"
          class="flex items-center justify-center space-x-2 text-xl">
          <i
            *ngIf="quantity > 0"
            (click)="removeItem(quantity)"
            class="fa-solid fa-square-xmark cursor-pointer"></i>
          <i
            *ngIf="quantity > 0 && modifyQuantity"
            (click)="removeItem()"
            class="fa-solid fa-square-minus cursor-pointer"></i>
          <span
            *ngIf="quantity > 0 && modifyQuantity"
            class="select-none text-base"
            >{{ quantity }}
          </span>
          <i
            *ngIf="quantity < 1 || modifyQuantity"
            (click)="addItem()"
            class="fa-solid fa-square-plus cursor-pointer">
          </i>
        </span>

        <span *ngIf="isAdmin">
          <i
            (click)="modifyItem()"
            class="fa-solid fa-square-pen cursor-pointer text-2xl"></i>
        </span>
      </span>
    </div>
  `,
  styles: [],
})
export class ItemCardComponent {
  @Input() item?: Item;
  @Input() quantity: number = 0;
  @Input() modifyQuantity: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() addItemEvent = new EventEmitter<Item>();
  @Output() modifyItemEvent = new EventEmitter<Item>();
  @Output() removeItemEvent = new EventEmitter<string>();

  addItem() {
    this.addItemEvent.emit(this.item!);
  }

  modifyItem() {
    this.modifyItemEvent.emit(this.item!);
  }

  removeItem(quantity: number = 1) {
    for (let index = quantity; index > 0; index--) {
      this.removeItemEvent.emit(this.item!._id);
    }
  }

  constructor() {}
}
