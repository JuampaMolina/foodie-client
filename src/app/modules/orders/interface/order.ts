import { Item } from '../../items/interface/item';
import { User } from '../../users/interface/user';

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  totalPrice: number;
  date: Date;
  status?: OrderStatus;
  user?: User;
  items?: Item[];
}
