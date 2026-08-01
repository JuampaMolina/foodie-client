import { Item } from '../../items/interface/item';
import { User } from '../../users/interface/user';

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export interface OrderItem {
  item: Item;
  quantity: number;
}

export interface Order {
  _id: string;
  totalPrice: number;
  date: Date;
  address?: string;
  status?: OrderStatus;
  user?: User;
  items?: OrderItem[];
}
