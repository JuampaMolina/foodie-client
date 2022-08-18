import { Order } from './order';
import { Item } from '../../items/interface/item';

export interface OrdersState {
  orders: Order[];
  cart: Item[];
  loading: boolean;
  loaded: boolean;
  error: any;
}
