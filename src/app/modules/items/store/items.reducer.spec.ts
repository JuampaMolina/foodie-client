import { Item } from '../interface/item';
import {
  createItemSuccess,
  deleteItemSuccess,
  getItems,
  getItemsByCategoryIdSuccess,
  getItemsError,
  getItemsSuccess,
  updateItemSuccess,
} from './items.actions';
import { itemsInitalState, itemsReducer } from './items.reducer';

describe('itemsReducer', () => {
  const item: Item = { _id: '1', name: 'Pizza', description: '', price: 10 };

  it('should return the initial state for an unknown action', () => {
    const state = itemsReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(itemsInitalState);
  });

  it('should set loading on getItems', () => {
    const state = itemsReducer(itemsInitalState, getItems());
    expect(state.loading).toBeTrue();
    expect(state.loaded).toBeFalse();
  });

  it('should set the error message on getItemsError', () => {
    const state = itemsReducer(
      itemsInitalState,
      getItemsError({ error: { message: 'boom' } })
    );
    expect(state.error).toBe('boom');
  });

  it('should populate items on getItemsSuccess', () => {
    const state = itemsReducer(
      itemsInitalState,
      getItemsSuccess({ items: [item] })
    );
    expect(state.items).toEqual([item]);
    expect(state.loaded).toBeTrue();
  });

  it('should populate items on getItemsByCategoryIdSuccess', () => {
    const state = itemsReducer(
      itemsInitalState,
      getItemsByCategoryIdSuccess({ items: [item] })
    );
    expect(state.items).toEqual([item]);
  });

  it('should append the item on createItemSuccess', () => {
    const newItem: Item = {
      _id: '2',
      name: 'Pasta',
      description: '',
      price: 8,
    };
    const state = itemsReducer(
      { ...itemsInitalState, items: [item] },
      createItemSuccess({ item: newItem })
    );
    expect(state.items).toEqual([item, newItem]);
  });

  it('should replace the matching item on updateItemSuccess', () => {
    const updated: Item = {
      _id: '1',
      name: 'Pizza grande',
      description: '',
      price: 12,
    };
    const state = itemsReducer(
      { ...itemsInitalState, items: [item] },
      updateItemSuccess({ item: updated })
    );
    expect(state.items).toEqual([updated]);
  });

  it('should remove the matching item on deleteItemSuccess', () => {
    const state = itemsReducer(
      { ...itemsInitalState, items: [item] },
      deleteItemSuccess({ item })
    );
    expect(state.items).toEqual([]);
  });
});
