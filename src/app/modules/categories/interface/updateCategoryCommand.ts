import { CreateCategoryCommand } from './createCategoryCommand';

export interface UpdateCategoryCommand {
  categoryId: string;
  category: CreateCategoryCommand;
}
