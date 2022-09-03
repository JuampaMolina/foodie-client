import { Item } from '../../items/interface/item';
import { Order } from './order';

export interface OrdersState {
  orders: Order[];
  cart: Item[];
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
