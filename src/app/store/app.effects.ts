import { CategoriesEffects } from '../modules/categories/store/categories.effects';
import { ItemsEffects } from '../modules/items/store/items.effects';
import { MetricsEffects } from '../modules/metrics/store/metrics.effects';
import { OrdersEffects } from '../modules/orders/store/orders.effects';
import { UsersEffects } from '../modules/users/store/users.effects';

export const appEffects: any[] = [
  ItemsEffects,
  CategoriesEffects,
  OrdersEffects,
  UsersEffects,
  MetricsEffects,
];
