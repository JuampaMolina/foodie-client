import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../interface/category';

const DEFAULT_CATEGORY_IMAGE = 'assets/categories/placeholder.svg';

@Component({
  selector: 'app-category-card',
  template: `
    @if (category) {
    <button
      type="button"
      (click)="selectCategory()"
      class="group flex w-[4.5rem] shrink-0 cursor-pointer flex-col items-center gap-2 sm:w-20"
      [attr.aria-pressed]="isSelected">
      <span
        class="flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-neutral-50 transition duration-150 group-hover:-translate-y-0.5 dark:ring-offset-[#0c0a09]"
        [class]="
          isSelected
            ? 'ring-brand-600'
            : 'ring-transparent group-hover:ring-brand-200 dark:group-hover:ring-brand-500/40'
        ">
        <img
          [src]="category.image || defaultImage"
          [alt]="category.name"
          class="h-full w-full rounded-full object-cover" />
      </span>
      <span
        class="w-full truncate text-center text-xs font-semibold transition"
        [class]="
          isSelected
            ? 'text-brand-700 dark:text-brand-400'
            : 'text-neutral-600 dark:text-neutral-300'
        "
        >{{ category.name }}</span
      >
    </button>
    }
  `,
  styles: [],
})
export class CategoryCardComponent {
  @Input() category?: Category;
  @Input() selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<Category>();

  readonly defaultImage = DEFAULT_CATEGORY_IMAGE;

  get isSelected(): boolean {
    return !!this.category && this.selectedCategory === this.category._id;
  }

  selectCategory = () => {
    this.categorySelected.emit(this.category);
  };

  constructor() {}
}
