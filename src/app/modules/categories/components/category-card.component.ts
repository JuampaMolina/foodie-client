import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../interface/category';

const DEFAULT_CATEGORY_IMAGE = 'assets/categories/placeholder.svg';

@Component({
  selector: 'app-category-card',
  template: `
    @if (category) {
    <div
      (click)="selectCategory()"
      class="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 font-semibold transition duration-150"
      [class]="
        selectedCategory === this.category._id
          ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
      ">
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 p-1 dark:bg-black/10">
        <img
          [src]="category.image || defaultImage"
          [alt]="category.name"
          class="h-full w-full rounded-full object-cover" />
      </span>
      <span>{{ category.name }}</span>
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
