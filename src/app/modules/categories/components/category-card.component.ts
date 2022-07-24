import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from '../interface/category';

@Component({
  selector: 'app-category-card',
  template: `
   <div
    *ngIf="category"
    (click)=selectCategory()
    class="bg-slate-200 text-slate-800 hover:bg-slate-300 transition duration-150 cursor-pointer rounded-md p-4"
    [class]="selectedCategory === this.category._id ? 'bg-slate-300' : ''">
    <span class="font-semibold">{{category.name}}</span>
   </div>
  `,
  styles: [
  ]
})
export class CategoryCardComponent implements OnInit {

  @Input() category?: Category;
  @Input() selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<string>();

  selectCategory = () => { this.categorySelected.emit(this.category?._id) }

  constructor() { }

  ngOnInit(): void {
  }

}
