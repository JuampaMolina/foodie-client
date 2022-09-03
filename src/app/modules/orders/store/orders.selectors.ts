import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { OrdersState } from '../interface/orders-state';

const _selectOrdersState = (state: AppState): OrdersState => state.orders;

export const selectOrdersState = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state
);

export const selectOrdersMessage = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.message
);

export const selectOrdersError = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.error
);

export const selectOrdersLoading = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.loading
);

export const selectOrders = createSelector(
  _selectOrdersState,
  (state: OrdersState) => {
    let sortedOrders = [...state.orders];
    return sortedOrders.sort(
      (a, b) => Number(new Date(b.date)) - Number(new Date(a.date))
    );
  }
);

export const selectCart = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.cart
);

export const selectCartUniqueItems = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.cart.filter((x, i, a) => a.indexOf(x) == i)
  // [...new Set(state.cart)]
);

export const selectCartCount = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.cart.length
);

export const selectCartTotalPrice = createSelector(
  _selectOrdersState,
  (state: OrdersState) => {
    let total = 0;
    state.cart.map(item => {
      total = total + item.price;
    });
    return total;
  }
);
