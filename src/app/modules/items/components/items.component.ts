import { Component, OnInit } from '@angular/core';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getItems } from '../store/items.actions';

@Component({
  selector: 'app-items',
  template: `
    <div class="mx-auto w-11/12 my-16">
      <button (click)="create = !create" *ngIf="!create" class="px-4 py-2 cursor-pointer bg-slate-200 rounded-md hover:bg-slate-300 transition duration-150">
        Añadir
      </button>

      <button (click)="create = !create" *ngIf="create" class="px-4 py-2 cursor-pointer bg-slate-200 rounded-md hover:bg-slate-300 transition duration-150">
        Cerrar
      </button>

      <!-- todo: separar componente -->
      <div *ngIf="error">
        {{error}}
      </div>

      <ng-container *ngIf="create">
        <app-item-form (formValue)="createItem($event)"></app-item-form>
      </ng-container>

      <div class="w-full my-8 grid grid-cols-4 gap-4">
        <app-item-card *ngFor="let item of items" [item]="item"></app-item-card>
      </div>
    </div>
  `
})
export class ItemsComponent implements OnInit {

  create: boolean = false;

  items: Item[] = [];
  error: any;

  constructor(private itemsApi: ItemsApiService, private store: Store<AppState>) { }

  createItem(item: Item) {
    this.itemsApi.createItem(item).subscribe(res => console.log(res));
  }

  getItems() {
    this.store.dispatch(getItems());
  }

  // todo: crear selectores
  ngOnInit(): void {
    this.store.subscribe(({ items }) => {
      this.items = items.items
      this.error = items.error
    });
    this.getItems();
  }

}
