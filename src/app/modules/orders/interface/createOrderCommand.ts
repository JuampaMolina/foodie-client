export interface CreateOrderCommand {
  totalPrice: number;
  date: Date;
  user: string;
  items: string[];
}
