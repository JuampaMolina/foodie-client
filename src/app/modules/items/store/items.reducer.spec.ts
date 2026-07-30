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
import { itemsAdapter, itemsInitalState, itemsReducer } from './items.reducer';

const { selectAll } = itemsAdapter.getSelectors();

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
    expect(selectAll(state)).toEqual([item]);
    expect(state.loaded).toBeTrue();
  });

  it('should populate items on getItemsByCategoryIdSuccess', () => {
    const state = itemsReducer(
      itemsInitalState,
      getItemsByCategoryIdSuccess({ items: [item] })
    );
    expect(selectAll(state)).toEqual([item]);
  });

  it('should append the item on createItemSuccess', () => {
    const newItem: Item = {
      _id: '2',
      name: 'Pasta',
      description: '',
      price: 8,
    };
    const seeded = itemsAdapter.setAll([item], itemsInitalState);
    const state = itemsReducer(seeded, createItemSuccess({ item: newItem }));
    expect(selectAll(state)).toEqual([item, newItem]);
  });

  it('should replace the matching item on updateItemSuccess', () => {
    const updated: Item = {
      _id: '1',
      name: 'Pizza grande',
      description: '',
      price: 12,
    };
    const seeded = itemsAdapter.setAll([item], itemsInitalState);
    const state = itemsReducer(seeded, updateItemSuccess({ item: updated }));
    expect(selectAll(state)).toEqual([updated]);
  });

  it('should remove the matching item on deleteItemSuccess', () => {
    const seeded = itemsAdapter.setAll([item], itemsInitalState);
    const state = itemsReducer(seeded, deleteItemSuccess({ item }));
    expect(selectAll(state)).toEqual([]);
  });
});
