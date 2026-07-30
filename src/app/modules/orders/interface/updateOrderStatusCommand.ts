import { OrderStatus } from './order';

export interface UpdateOrderStatusCommand {
  orderId: string;
  status: OrderStatus;
}
