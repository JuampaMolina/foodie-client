import { EntityState } from '@ngrx/entity';
import { Category } from './category';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
