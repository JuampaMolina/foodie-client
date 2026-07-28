import { Item } from '../../items/interface/item';
import { User } from '../../users/interface/user';

export interface Order {
  _id: string;
  totalPrice: number;
  date: Date;
  user?: User;
  items?: Item[];
}
