import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../interface/item';

@Component({
  selector: 'app-item-card',
  template: `
    <div
      *ngIf="item"
      class="flex h-32 cursor-pointer flex-col rounded bg-slate-200 p-4 text-slate-800">
      <div class="space-x-2">
        <span class="font-semibold">{{ item.name }}</span>
        <span class="text-xs font-extralight">{{ item.category.name }}</span>
      </div>
      <span class="grow font-light">{{ item.description }}</span>
      <span class="text-right ">{{ item.price }} EUR</span>
    </div>
  `,
  styles: [],
})
export class ItemCardComponent {
  @Input() item?: Item;

  constructor() {}
}
