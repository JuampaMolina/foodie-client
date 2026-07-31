import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { TopItem } from '../interface/topItem';
import { getSalesByDay } from '../store/metrics.actions';
import { selectSalesByDay, selectTopItems } from '../store/metrics.selectors';
import { MetricsDashboardComponent } from './metrics-dashboard.component';

describe('MetricsDashboardComponent', () => {
  let fixture: ComponentFixture<MetricsDashboardComponent>;
  let store: MockStore;

  const salesByDay: SalesByDayPoint[] = [
    { day: '2026-07-29', revenue: 40, orders: 5 },
    { day: '2026-07-30', revenue: 60, orders: 8 },
  ];
  const topItems: TopItem[] = [
    { itemId: '1', name: 'Pizza Margarita', quantity: 33 },
    { itemId: '2', name: 'Coca-Cola', quantity: 20 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsDashboardComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSalesByDay, value: salesByDay },
            { selector: selectTopItems, value: topItems },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MetricsDashboardComponent);
    fixture.detectChanges();
  });

  it('should show total revenue and orders as KPI tiles', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('100 EUR');
    expect(text).toContain('13');
  });

  it('should render a line point per day in the sales chart', () => {
    const circles = fixture.nativeElement.querySelectorAll('circle');
    expect(circles.length).toBe(salesByDay.length);
  });

  it('should render a bar per top item', () => {
    const bars = fixture.nativeElement.querySelectorAll('rect');
    expect(bars.length).toBe(topItems.length);
  });

  it('should switch to the sales table view on toggle', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    );
    const toggle = buttons.find(button =>
      button.textContent?.includes('Ver tabla')
    )!;
    toggle.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table')).not.toBeNull();
  });

  it('should dispatch getSalesByDay with the selected range', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    );
    const sevenDays = buttons.find(button =>
      button.textContent?.includes('7 días')
    )!;
    sevenDays.click();

    expect(dispatchSpy).toHaveBeenCalledWith(getSalesByDay({ days: 7 }));
  });
});
