import { Component, Input, OnInit } from '@angular/core';
import { CategoriesApiService } from '../services/categories-api.service';
import { Category } from '../interface/category';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCategories, createCategory } from '../store/categories.actions';
import { ActivatedRoute } from '@angular/router';
import {
  getItemsByCategoryId,
  getItems,
} from '../../items/store/items.actions';

@Component({
  selector: 'app-categories',
  template: `
    <div class="grid-responsive-container-md">
      <div
        *ngIf="isAdmin"
        (click)="create = true"
        class="h-14 cursor-pointer rounded-md bg-slate-800 p-4 text-center text-slate-100 transition duration-150 hover:bg-slate-700">
        <i class="fa-solid fa-circle-plus text-xl"></i>
      </div>
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
  isAdmin: boolean = false;
  create: boolean = false;

  selectedCategory: string = '';

  categories: Category[] = [];
  error: any;

  constructor(
    private categoriesApi: CategoriesApiService,
    private route: ActivatedRoute,
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

  checkAdmin() {
    const isAdmin = this.route.parent?.snapshot.data;
    if (isAdmin?.['isAdmin']) {
      this.isAdmin = isAdmin?.['isAdmin'];
    }
  }

  // todo: crear selectores
  ngOnInit(): void {
    this.checkAdmin();
    this.store.subscribe(({ categories }) => {
      this.categories = categories.categories;
      this.error = categories.error;
    });
    this.getCategories();
  }
}
