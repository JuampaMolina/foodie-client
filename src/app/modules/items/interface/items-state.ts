import { EntityState } from '@ngrx/entity';
import { Item } from './item';

export interface ItemsState extends EntityState<Item> {
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
