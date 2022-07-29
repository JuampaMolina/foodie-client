import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from '../interface/category';

@Component({
  selector: 'app-category-card',
  template: `
    <div
      *ngIf="category"
      (click)="selectCategory()"
      class="h-14 cursor-pointer rounded-md bg-slate-200 p-4 text-center text-slate-800 transition duration-150 hover:bg-slate-300"
      [class]="selectedCategory === this.category._id ? 'bg-slate-300' : ''">
      <span class="font-semibold">{{ category.name }}</span>
    </div>
  `,
  styles: [],
})
export class CategoryCardComponent {
  @Input() category?: Category;
  @Input() selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<string>();

  selectCategory = () => {
    this.categorySelected.emit(this.category?._id);
  };

  constructor() {}
}
