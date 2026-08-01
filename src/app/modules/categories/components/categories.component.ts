import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import {
  getItems,
  getItemsByCategoryId,
} from '../../../modules/items/store/items.actions';
import { selectIsAdmin } from '../../users/store/users.selectors';
import { Category } from '../interface/category';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../store/categories.actions';
import { selectCategories } from '../store/categories.selectors';
import { CategoryCardComponent } from './category-card.component';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { CategoryFormComponent } from './category-form.component';

@Component({
  selector: 'app-categories',
  template: `
    <!--
      overflow-x-auto también recorta en vertical, así que el padding deja sitio
      al anillo de selección y al desplazamiento del hover. Los márgenes
      negativos lo compensan para no alterar la posición de la fila.
    -->
    <div class="-mx-2 -mt-2 flex gap-2 overflow-x-auto px-2 pt-2 pb-3 sm:gap-3">
      @if (isAdmin()) {
      <button
        type="button"
        (click)="create = true"
        class="group flex w-[4.5rem] shrink-0 cursor-pointer flex-col items-center gap-2 sm:w-20">
        <span
          class="primary-button h-16 w-16 rounded-full p-0 transition duration-150 group-hover:-translate-y-0.5">
          <i class="fa-solid fa-plus text-xl"></i>
        </span>
        <span
          class="w-full truncate text-center text-xs font-semibold text-neutral-600 dark:text-neutral-300"
          >Nueva</span
        >
      </button>
      } @for (category of categories(); track category) {
      <app-category-card
        [category]="category"
        [selectedCategory]="selectedCategory"
        (categorySelected)="selectCategory($event)">
      </app-category-card>
      }
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
      [visible]="!!modify"
      (visibleChange)="onModifyVisibleChange($event)"
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
  imports: [CategoryCardComponent, Bind, Dialog, CategoryFormComponent],
})
export class CategoriesComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  categories = toSignal(this.store.select(selectCategories), {
    initialValue: [],
  });
  isAdmin = toSignal(this.store.select(selectIsAdmin), { initialValue: false });

  create: boolean = false;
  reset: boolean = false;
  modify?: Category;
  selectedCategory: string = '';

  selectCategory = (category: Category) => {
    if (this.isAdmin()) {
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

  onModifyVisibleChange(visible: boolean) {
    if (!visible) {
      this.modify = undefined;
    }
  }

  getCategories() {
    this.store.dispatch(getCategories());
  }

  getItemsByCategoryId(categoryId: string) {
    this.store.dispatch(getItemsByCategoryId({ categoryId }));
  }

  ngOnInit(): void {
    this.getCategories();
  }
}
