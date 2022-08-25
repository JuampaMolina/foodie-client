export interface CreateOrderCommand {
  totalPrice: number;
  date: string;
  user: string;
  items: string[];
}
