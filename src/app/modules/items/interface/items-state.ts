import { Item } from './item';

export interface ItemsState {
  items: Item[];
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
