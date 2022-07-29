import { Component, OnInit } from '@angular/core';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getItems, createItem } from '../store/items.actions';
import { CreateItemCommand } from '../interface/createItemCommand';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  template: `
    <div>
      <!-- <ng-container *ngIf="create">
        <app-item-form (formValue)="createItem($event)"></app-item-form>
      </ng-container> -->

      <!-- todo: separar componente -->
      <div *ngIf="error">
        {{ error }}
      </div>

      <div class="grid-responsive-container-xl">
        <div
          class="flex h-32 items-center justify-center rounded-md bg-slate-800 p-4 text-slate-100">
          <i class="fa-solid fa-circle-plus text-3xl"></i>
        </div>
        <app-item-card *ngFor="let item of items" [item]="item"></app-item-card>
      </div>
    </div>
  `,
  styles: [''],
})
export class ItemsComponent implements OnInit {
  isAdmin: boolean = false;
  create: boolean = false;

  items: Item[] = [];
  error: any;

  constructor(
    private itemsApi: ItemsApiService,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  createItem(item: CreateItemCommand) {
    this.store.dispatch(createItem({ item }));
  }

  getItems() {
    this.store.dispatch(getItems());
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
    this.getItems();
  }
}
