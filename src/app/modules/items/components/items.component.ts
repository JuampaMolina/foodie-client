import { Component, OnInit, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Item } from '../interface/item';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from '../store/items.actions';

import { selectIsAdmin } from 'src/app/modules/users/store/users.selectors';
import { getCategories } from '../../categories/store/categories.actions';
import { selectCategories } from '../../categories/store/categories.selectors';
import {
  addItemToCart,
  removeItemFromCart,
} from '../../orders/store/orders.actions';
import { selectCart } from '../../orders/store/orders.selectors';
import { CreateItemCommand } from '../interface/createItemCommand';
import { UpdateItemCommand } from '../interface/updateItemCommand';
import { selectItems } from '../store/items.selectors';
import { ItemCardComponent } from './item-card.component';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { ItemFormComponent } from './item-form.component';

@Component({
  selector: 'app-items',
  template: `
    <div class="grid-responsive-container-xl">
      @if (isAdmin()) {
      <div (click)="create = true" class="primary-button h-32">
        <i class="fa-solid fa-circle-plus text-3xl"></i>
      </div>
      } @for (item of items(); track item) {
      <app-item-card
        (modifyItemEvent)="modifyItem($event)"
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [isAdmin]="isAdmin()"
        [item]="item"
        [quantity]="getQuantity(item._id)">
      </app-item-card>
      }
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
        [categories]="categories()"
        [reset]="reset"
        (createEvent)="createItem($event)">
      </app-item-form>
    </p-dialog>
    <p-dialog
      header="Modificar producto"
      [visible]="!!modify"
      (visibleChange)="onModifyVisibleChange($event)"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false">
      <app-item-form
        [modify]="modify"
        [categories]="categories()"
        (updateEvent)="updateItem($event)"
        (deleteEvent)="deleteItem($event)">
      </app-item-form>
    </p-dialog>
  `,
  styles: [],
  imports: [ItemCardComponent, Bind, Dialog, ItemFormComponent],
})
export class ItemsComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  items = toSignal(this.store.select(selectItems), { initialValue: [] });
  categories = toSignal(this.store.select(selectCategories), {
    initialValue: [],
  });
  cart = toSignal(this.store.select(selectCart), { initialValue: [] });
  isAdmin = toSignal(this.store.select(selectIsAdmin), { initialValue: false });

  create: boolean = false;
  reset: boolean = false;
  modify?: Item;

  constructor() {
    effect(() => {
      if (this.isAdmin()) {
        this.getCategories();
      }
    });
  }

  modifyItem(item: Item) {
    this.modify = item;
  }

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  getQuantity(itemId: string) {
    return this.cart().filter(item => item._id === itemId).length;
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

  onModifyVisibleChange(visible: boolean) {
    if (!visible) {
      this.modify = undefined;
    }
  }

  getItems() {
    this.store.dispatch(getItems());
  }

  getCategories() {
    this.store.dispatch(getCategories());
  }

  ngOnInit(): void {
    this.getItems();
  }
}
