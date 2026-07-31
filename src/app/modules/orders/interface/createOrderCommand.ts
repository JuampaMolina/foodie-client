export interface OrderItemCommand {
  item: string;
  quantity: number;
}

export interface CreateOrderCommand {
  totalPrice: number;
  date: Date;
  items: OrderItemCommand[];
  address: string;
}
