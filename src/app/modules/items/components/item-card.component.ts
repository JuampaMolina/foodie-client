import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../interface/item';

@Component({
  selector: 'app-item-card',
  template: `
   <div
    *ngIf="item"
    class="bg-slate-200 flex flex-col text-slate-800 rounded-md p-4 max-w-sm h-32">
    <div class="space-x-2">
      <span class="font-semibold">{{item.name}}</span>
      <span class="font-extralight text-xs">{{item.category}}</span>
    </div>
    <span class="font-light grow">{{item.description}}</span>
    <span class="text-right ">{{item.price}} EUR</span>
   </div>
  `,
  styles: [
  ]
})
export class ItemCardComponent implements OnInit {

  @Input() item?: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
