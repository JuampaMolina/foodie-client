import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../interface/category';

@Component({
  selector: 'app-category-card',
  template: `
   <div
    *ngIf="category"
    class="bg-slate-200 text-slate-800 rounded-md p-4">
    <span class="font-semibold">{{category.name}}</span>
   </div>
  `,
  styles: [
  ]
})
export class CategoryCardComponent implements OnInit {

  @Input() category?: Category;

  constructor() { }

  ngOnInit(): void {
  }

}
