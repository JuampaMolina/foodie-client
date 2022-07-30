import { Component, OnInit } from '@angular/core';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getItems, createItem } from '../store/items.actions';
import { getCategories } from '../../categories/store/categories.actions';
import { CreateItemCommand } from '../interface/createItemCommand';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../categories/interface/category';

@Component({
  selector: 'app-items',
  template: `
    <div class="grid-responsive-container-xl">
      <div *ngIf="isAdmin" (click)="create = true" class="primary-button h-32">
        <i class="fa-solid fa-circle-plus text-3xl"></i>
      </div>
      <app-item-card *ngFor="let item of items" [item]="item"></app-item-card>
    </div>
    <p-dialog
      header="Añadir nuevo producto"
      [(visible)]="create"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      <app-item-form [categories]="categories" (formValue)="createItem($event)">
      </app-item-form>
    </p-dialog>
  `,
  styles: [''],
})
export class ItemsComponent implements OnInit {
  isAdmin: boolean = false;
  create: boolean = false;

  items: Item[] = [];
  categories: Category[] = [];

  error: any;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  createItem(item: CreateItemCommand) {
    this.store.dispatch(createItem({ item }));
    this.create = false;
  }

  getItems() {
    this.store.dispatch(getItems());
  }

  getCategories() {
    this.store.dispatch(getCategories());
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
    this.store.subscribe(({ items }) => {
      this.items = items.items;
      this.error = items.error;
    });

    this.store.subscribe(({ categories }) => {
      this.categories = categories.categories;
    });

    this.getItems();
    this.getCategories();
  }
}
