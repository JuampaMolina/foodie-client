import { CreateItemCommand } from './createItemCommand';

export interface UpdateItemCommand {
  itemId: string;
  item: CreateItemCommand;
}
