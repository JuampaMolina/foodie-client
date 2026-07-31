import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../interface/category';

const DEFAULT_CATEGORY_IMAGE = 'assets/categories/placeholder.svg';

@Component({
  selector: 'app-category-card',
  template: `
    @if (category) {
    <div
      (click)="selectCategory()"
      class="secondary-button flex h-14 items-center justify-center gap-2"
      [class]="
        selectedCategory === this.category._id
          ? 'bg-slate-300 dark:bg-slate-600'
          : ''
      ">
      <img
        [src]="category.image || defaultImage"
        [alt]="category.name"
        class="h-8 w-8 shrink-0 rounded object-cover" />
      <span class="font-semibold">{{ category.name }}</span>
    </div>
    }
  `,
  styles: [],
})
export class CategoryCardComponent {
  @Input() category?: Category;
  @Input() selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<Category>();

  readonly defaultImage = DEFAULT_CATEGORY_IMAGE;

  selectCategory = () => {
    this.categorySelected.emit(this.category);
  };

  constructor() {}
}
