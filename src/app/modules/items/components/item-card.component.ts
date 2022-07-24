import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../interface/item';

@Component({
  selector: 'app-item-card',
  template: `
   <div
    *ngIf="item"
    class="bg-slate-200 flex flex-col text-slate-800 rounded-md p-4 max-w-sm h-32">
    <span class="font-semibold">{{item.name}}</span>
    <span class="font-light grow">{{item.description}}</span>
    <!-- <p>{{item.category}}</p> -->
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
