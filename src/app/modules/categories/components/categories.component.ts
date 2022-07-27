import { Component, OnInit } from '@angular/core';
import { CategoriesApiService } from '../services/categories-api.service';
import { Category } from '../interface/category';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCategories, createCategory } from '../store/categories.actions';
import {
  getItemsByCategoryId,
  getItems,
} from '../../items/store/items.actions';

@Component({
  selector: 'app-categories',
  template: `
    <div class="grid-responsive-container-md">
      <app-category-card
        *ngFor="let category of categories"
        [category]="category"
        [selectedCategory]="selectedCategory"
        (categorySelected)="selectCategory($event)">
      </app-category-card>
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  create: boolean = false;

  selectedCategory: string = '';

  categories: Category[] = [];
  error: any;

  constructor(
    private categoriesApi: CategoriesApiService,
    private store: Store<AppState>
  ) {}

  selectCategory = (category: string) => {
    if (this.selectedCategory !== category) {
      this.selectedCategory = category;
      this.getItemsByCategoryId(category);
    } else {
      this.selectedCategory = '';
      this.store.dispatch(getItems());
    }
  };

  createCategory(category: string) {
    this.store.dispatch(createCategory({ category }));
  }

  getCategories() {
    this.store.dispatch(getCategories());
  }

  getItemsByCategoryId(categoryId: string) {
    this.store.dispatch(getItemsByCategoryId({ categoryId }));
  }

  // todo: crear selectores
  ngOnInit(): void {
    this.store.subscribe(({ categories }) => {
      this.categories = categories.categories;
      this.error = categories.error;
    });
    this.getCategories();
  }
}
