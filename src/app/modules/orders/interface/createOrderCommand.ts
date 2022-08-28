export interface CreateOrderCommand {
  totalPrice: number;
  date: string;
  items: string[];
}
