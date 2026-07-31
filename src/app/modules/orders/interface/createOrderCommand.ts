export interface CreateOrderCommand {
  totalPrice: number;
  date: Date;
  items: string[];
  address: string;
}
