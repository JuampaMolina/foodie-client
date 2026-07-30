export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: {
    _id: string;
    name: string;
  };
}
