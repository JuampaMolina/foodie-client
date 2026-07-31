import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { TopItem } from '../interface/topItem';
import {
  getSalesByDay,
  getSalesByDayError,
  getSalesByDaySuccess,
  getTopItems,
  getTopItemsError,
  getTopItemsSuccess,
} from './metrics.actions';
import { metricsInitialState, metricsReducer } from './metrics.reducer';

describe('metricsReducer', () => {
  const salesByDay: SalesByDayPoint[] = [
    { day: '2026-07-30', revenue: 60, orders: 8 },
  ];
  const topItems: TopItem[] = [{ itemId: '1', name: 'Pizza', quantity: 5 }];

  it('should return the initial state for an unknown action', () => {
    const state = metricsReducer(undefined, { type: 'noop' } as any);
    expect(state).toEqual(metricsInitialState);
  });

  it('should set loading on getSalesByDay', () => {
    const state = metricsReducer(metricsInitialState, getSalesByDay({}));
    expect(state.salesByDayLoading).toBeTrue();
  });

  it('should set the error message on getSalesByDayError', () => {
    const state = metricsReducer(
      metricsInitialState,
      getSalesByDayError({ error: { message: 'boom' } })
    );
    expect(state.salesByDayError).toBe('boom');
  });

  it('should populate salesByDay on getSalesByDaySuccess', () => {
    const state = metricsReducer(
      metricsInitialState,
      getSalesByDaySuccess({ salesByDay })
    );
    expect(state.salesByDay).toEqual(salesByDay);
    expect(state.salesByDayLoading).toBeFalse();
  });

  it('should set loading on getTopItems', () => {
    const state = metricsReducer(metricsInitialState, getTopItems({}));
    expect(state.topItemsLoading).toBeTrue();
  });

  it('should set the error message on getTopItemsError', () => {
    const state = metricsReducer(
      metricsInitialState,
      getTopItemsError({ error: { message: 'boom' } })
    );
    expect(state.topItemsError).toBe('boom');
  });

  it('should populate topItems on getTopItemsSuccess', () => {
    const state = metricsReducer(
      metricsInitialState,
      getTopItemsSuccess({ topItems })
    );
    expect(state.topItems).toEqual(topItems);
    expect(state.topItemsLoading).toBeFalse();
  });
});
