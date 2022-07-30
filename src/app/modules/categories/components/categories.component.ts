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
      <div *ngIf="isAdmin" (click)="create = true" class="primary-button">
        <i class="fa-solid fa-circle-plus text-xl"></i>
      </div>
      <app-category-card
        *ngFor="let category of categories"
        [category]="category"
        [selectedCategory]="selectedCategory"
        (categorySelected)="selectCategory($event)">
      </app-category-card>
      <p-dialog
        header="Añadir nueva categoría"
        [(visible)]="create"
        [modal]="true"
        [style]="{ width: '50vw' }"
        [draggable]="false"
        [resizable]="false">
        <app-category-form
          (formValue)="createCategory($event)"></app-category-form>
      </p-dialog>
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  isAdmin: boolean = false;
  create: boolean = false;

  selectedCategory: string = '';

  categories: Category[] = [];
  error: any;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  selectCategory = (category: string) => {
    if (this.isAdmin) return;
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
    // todo: debería cerrarse solo si es success?
    this.create = false;
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
