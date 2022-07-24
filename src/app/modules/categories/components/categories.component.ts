import { Component, OnInit } from '@angular/core';
import { CategoriesApiService } from '../services/categories-api.service';
import { Category } from '../interface/category';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCategories, createCategory } from '../store/categories.actions';

@Component({
  selector: 'app-categories',
  template: `
    <div class="mx-auto w-11/12 my-16">
      <div class="w-full my-8 grid grid-cols-6 gap-4">
        <app-category-card *ngFor="let category of categories" [category]="category"></app-category-card>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {

  create: boolean = false;

  categories: Category[] = [];
  error: any;

  constructor(private categoriesApi: CategoriesApiService, private store: Store<AppState>) { }

  createCategory(category: string) {
    this.store.dispatch(createCategory({ category }))
  }

  getCategories() {
    this.store.dispatch(getCategories());
  }

  // todo: crear selectores
  ngOnInit(): void {
    this.store.subscribe(({ categories }) => {
      this.categories = categories.categories
      this.error = categories.error
    });
    this.getCategories();
  }

}
