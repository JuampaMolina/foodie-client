import { Category } from './category';

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  loaded: boolean;
  error: string;
  message: string;
}
