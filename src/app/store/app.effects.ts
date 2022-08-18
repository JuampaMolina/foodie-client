import { ItemsEffects } from '../modules/items/store/items.effects';
import { CategoriesEffects } from '../modules/categories/store/categories.effects';
import { OrdersEffects } from '../modules/orders/store/orders.effects';

export const appEffects: any[] = [
  ItemsEffects,
  CategoriesEffects,
  OrdersEffects,
];
