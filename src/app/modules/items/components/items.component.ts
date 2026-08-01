import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

type SortBy = 'name' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-items',
  template: `
    <div class="mb-5 flex flex-wrap gap-3">
      <div class="relative grow">
        <i
          class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400"></i>
        <input
          [value]="search()"
          (input)="onSearchChange($event)"
          placeholder="Buscar por nombre..."
          class="form-input pl-10"
          type="text" />
      </div>
      <input
        [value]="minPrice() ?? ''"
        (input)="onMinPriceChange($event)"
        placeholder="Precio mín."
        class="form-input w-32"
        type="number"
        min="0" />
      <input
        [value]="maxPrice() ?? ''"
        (input)="onMaxPriceChange($event)"
        placeholder="Precio máx."
        class="form-input w-32"
        type="number"
        min="0" />
      <select
        [value]="categoryFilter()"
        (change)="onCategoryFilterChange($event)"
        class="select-background form-input w-44 cursor-pointer">
        <option value="">Todas las categorías</option>
        @for (category of categories(); track category._id) {
        <option [value]="category._id">{{ category.name }}</option>
        }
      </select>
      <select
        [value]="sortBy()"
        (change)="onSortByChange($event)"
        class="select-background form-input w-44 cursor-pointer">
        <option value="name">Nombre (A-Z)</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
      </select>
    </div>
    @if (items().length > 0 && filteredItems().length === 0) {
    <div
      class="surface-card flex flex-col items-center gap-2 py-16 text-center">
      <i
        class="fa-solid fa-magnifying-glass text-3xl text-neutral-300 dark:text-neutral-600"></i>
      <span class="text-lg font-semibold text-neutral-500 dark:text-neutral-400"
        >No hay productos que coincidan con la búsqueda</span
      >
    </div>
    }
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      @if (isAdmin()) {
      <button
        type="button"
        (click)="create = true"
        class="flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 text-neutral-500 transition duration-150 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 dark:hover:text-brand-400">
        <i class="fa-solid fa-plus text-2xl"></i>
        <span class="text-sm font-semibold">Nuevo producto</span>
      </button>
      } @for (item of filteredItems(); track item) {
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

  search = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  categoryFilter = signal('');
  sortBy = signal<SortBy>('name');

  filteredItems = computed(() => {
    const search = normalize(this.search().trim());
    const min = this.minPrice();
    const max = this.maxPrice();
    const categoryId = this.categoryFilter();
    const sortBy = this.sortBy();

    const filtered = this.items().filter(item => {
      const matchesSearch = !search || normalize(item.name).includes(search);
      const matchesMin = min == null || item.price >= min;
      const matchesMax = max == null || item.price <= max;
      const matchesCategory = !categoryId || item.category?._id === categoryId;
      return matchesSearch && matchesMin && matchesMax && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  });

  onSearchChange(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onMinPriceChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.minPrice.set(Number.isNaN(value) ? null : value);
  }

  onMaxPriceChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.maxPrice.set(Number.isNaN(value) ? null : value);
  }

  onCategoryFilterChange(event: Event) {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  onSortByChange(event: Event) {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortBy);
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
    this.getCategories();
  }
}
