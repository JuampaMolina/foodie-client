import { SalesByDayPoint } from './salesByDayPoint';
import { TopItem } from './topItem';

export interface MetricsState {
  salesByDay: SalesByDayPoint[];
  salesByDayLoading: boolean;
  salesByDayError: any;
  topItems: TopItem[];
  topItemsLoading: boolean;
  topItemsError: any;
}
