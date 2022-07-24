export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
}
