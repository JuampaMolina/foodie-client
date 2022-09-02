import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../interface/category';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/categories.actions';
import {
  getItems,
  getItemsByCategoryId,
} from '../../../modules/items/store/items.actions';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { selectCategories } from '../store/categories.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    </div>
    <p-dialog
      header="Añadir nueva categoría"
      [(visible)]="create"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="reset = true">
      <app-category-form [reset]="reset" (createEvent)="createCategory($event)">
      </app-category-form>
    </p-dialog>
    <p-dialog
      header="Modificar categoría"
      [(visible)]="modify"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      <app-category-form
        [modify]="modify"
        (updateEvent)="updateCategory($event)"
        (deleteEvent)="deleteCategory($event)">
      </app-category-form>
    </p-dialog>
  `,
})
export class CategoriesComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  create: boolean = false;
  reset: boolean = false;
  modify?: Category;
  selectedCategory: string = '';
  categories: Category[] = [];

  private onDestroy = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  selectCategory = (category: Category) => {
    if (this.isAdmin) {
      this.modify = category;
    } else {
      if (this.selectedCategory !== category._id) {
        this.selectedCategory = category._id;
        this.getItemsByCategoryId(category._id);
      } else {
        this.selectedCategory = '';
        this.store.dispatch(getItems());
      }
    }
  };

  createCategory(category: CreateCategoryCommand) {
    console.log('create: ', category);
    this.store.dispatch(createCategory({ category }));
    this.create = false;
  }

  updateCategory(categoryUpdate: UpdateCategoryCommand) {
    this.store.dispatch(updateCategory({ categoryUpdate }));
    console.log('update: ', categoryUpdate);
    this.modify = undefined;
  }

  deleteCategory(categoryId: string) {
    this.store.dispatch(deleteCategory({ categoryId }));
    console.log('delete: ', categoryId);
    this.modify = undefined;
  }

  getCategories() {
    this.store.dispatch(getCategories());
  }

  getItemsByCategoryId(categoryId: string) {
    this.store.dispatch(getItemsByCategoryId({ categoryId }));
  }

  ngOnInit(): void {
    this.store
      .select(selectCategories)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(categories => (this.categories = categories));

    this.store
      .select(selectIsAdmin)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });

    this.getCategories();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
