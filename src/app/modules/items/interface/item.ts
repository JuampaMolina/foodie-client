export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category?: {
    _id: string;
    name: string;
  };
}
