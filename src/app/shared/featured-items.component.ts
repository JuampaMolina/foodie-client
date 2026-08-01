import { Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { Item } from '../modules/items/interface/item';
import { ItemCardComponent } from '../modules/items/components/item-card.component';
import {
  addItemToCart,
  removeItemFromCart,
} from '../modules/orders/store/orders.actions';
import { selectCart } from '../modules/orders/store/orders.selectors';
import { selectItems } from '../modules/items/store/items.selectors';
import { getTopItems } from '../modules/metrics/store/metrics.actions';
import { selectTopItems } from '../modules/metrics/store/metrics.selectors';

const FEATURED_ITEMS_LIMIT = 8;

@Component({
  selector: 'app-featured-items',
  imports: [ItemCardComponent],
  template: `
    @if (featuredItems().length > 0) {
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      @for (item of featuredItems(); track item._id) {
      <app-item-card
        (addItemEvent)="addItem($event)"
        (removeItemEvent)="removeItem($event)"
        [item]="item"
        [quantity]="getQuantity(item._id)">
      </app-item-card>
      }
    </div>
    }
  `,
  styles: [],
})
export class FeaturedItemsComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  private topItems = toSignal(this.store.select(selectTopItems), {
    initialValue: [],
  });
  private items = toSignal(this.store.select(selectItems), {
    initialValue: [],
  });
  cart = toSignal(this.store.select(selectCart), { initialValue: [] });

  // El endpoint de destacados sólo conoce id/nombre/cantidad vendida (lo
  // justo para no exponer más de la cuenta en un endpoint público); el resto
  // de datos del producto (precio, descripción, categoría) se cruzan aquí
  // con el catálogo que la home ya tiene cargado.
  featuredItems = computed(() => {
    const itemsById = new Map(this.items().map(item => [item._id, item]));
    return this.topItems()
      .map(topItem => itemsById.get(topItem.itemId))
      .filter((item): item is Item => !!item);
  });

  addItem(item: Item) {
    this.store.dispatch(addItemToCart({ item }));
  }

  removeItem(itemId: string) {
    this.store.dispatch(removeItemFromCart({ itemId }));
  }

  getQuantity(itemId: string) {
    return this.cart().filter(item => item._id === itemId).length;
  }

  ngOnInit(): void {
    this.store.dispatch(getTopItems({ limit: FEATURED_ITEMS_LIMIT }));
  }
}
