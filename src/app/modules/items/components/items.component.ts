import { Component, OnInit } from '@angular/core';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from '../store/items.actions';

import { getCategories } from '../../categories/store/categories.actions';
import { CreateItemCommand } from '../interface/createItemCommand';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../categories/interface/category';
import { UpdateItemCommand } from '../interface/updateItemCommand';
import {
  addItemToCart,
  removeItemFromCart,
} from '../../orders/store/orders.actions';

@Component({
  selector: 'app-items',
  template: `
    <div class="grid-responsive-container-xl">
      <div *ngIf="isAdmin" (click)="create = true" class="primary-button h-32">
        <i class="fa-solid fa-circle-plus text-3xl"></i>
      </div>
      <app-item-card
        *ngFor="let item of items"
        (modifyItemEvent)="modifyItem($event)"
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [isAdmin]="isAdmin"
        [item]="item"
        [inCart]="inCart(item._id)">
      </app-item-card>
    </div>
    <p-dialog
      header="Añadir nuevo producto"
      [(visible)]="create"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="reset = true">
      <app-item-form
        [categories]="categories"
        [reset]="reset"
        (createEvent)="createItem($event)">
      </app-item-form>
    </p-dialog>
    <p-dialog
      header="Modificar producto"
      [(visible)]="modify"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      <app-item-form
        [modify]="modify"
        [categories]="categories"
        (updateEvent)="updateItem($event)"
        (deleteEvent)="deleteItem($event)">
      </app-item-form>
    </p-dialog>
  `,
  styles: [''],
})
export class ItemsComponent implements OnInit {
  isAdmin: boolean = false;
  create: boolean = false;
  reset: boolean = false;
  modify?: Item;

  items: Item[] = [];
  cart: Item[] = [];
  categories: Category[] = [];

  error: any;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  modifyItem(item: Item) {
    if (this.isAdmin) {
      this.modify = item;
    }
  }

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  inCart(itemId: string) {
    return this.cart.filter(item => item._id === itemId).length;
  }

  createItem(item: CreateItemCommand) {
    console.log('create: ', item);
    this.store.dispatch(createItem({ item }));
    this.create = false;
  }

  updateItem(itemUpdate: UpdateItemCommand) {
    this.store.dispatch(updateItem({ itemUpdate }));
    console.log('update: ', itemUpdate);
    this.modify = undefined;
  }

  deleteItem(itemId: string) {
    this.store.dispatch(deleteItem({ itemId }));
    console.log('delete: ', itemId);
    this.modify = undefined;
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

    this.store.subscribe(({ orders }) => {
      this.cart = orders.cart;
    });

    this.getItems();
    this.getCategories();
  }
}
