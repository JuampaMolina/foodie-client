import { createSelector } from '@ngrx/store';
import { OrdersState } from '../interface/orders-state';
import { AppState } from '../../../store/app.reducers';

const _selectOrdersState = (state: AppState): OrdersState => state.orders;

export const selectOrdersState = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state
);

export const selectOrders = createSelector(
  _selectOrdersState,
  (state: OrdersState) => state.orders
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
