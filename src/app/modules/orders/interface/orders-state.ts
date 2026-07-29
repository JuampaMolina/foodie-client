import { EntityState } from '@ngrx/entity';
import { Item } from '../../items/interface/item';
import { Order } from './order';

export interface OrdersState extends EntityState<Order> {
  cart: Item[];
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
