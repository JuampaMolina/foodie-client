import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { getSalesByDay, getTopItems } from '../store/metrics.actions';
import { selectSalesByDay, selectTopItems } from '../store/metrics.selectors';

const DAY_RANGES = [7, 30, 90] as const;
const TOP_ITEMS_LIMIT = 5;

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const CHART_PADDING = { top: 28, right: 16, bottom: 28, left: 56 };

const BAR_CHART_WIDTH = 600;
const BAR_HEIGHT = 24;
const BAR_GAP = 16;
const BAR_PADDING = { top: 8, right: 64, bottom: 8, left: 140 };

interface ChartPoint {
  x: number;
  y: number;
  data: SalesByDayPoint;
}

@Component({
  selector: 'app-metrics-dashboard',
  template: `
    <h2 class="title-2 mb-4">Métricas</h2>

    <div class="mb-4 flex items-center gap-2">
      <span class="form-label mb-0">Periodo</span>
      @for (range of dayRanges; track range) {
      <button
        class="secondary-button px-3 py-1"
        [class]="
          days() === range ? 'bg-brand-600 text-white hover:bg-brand-600' : ''
        "
        (click)="onDaysChange(range)">
        {{ range }} días
      </button>
      }
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="surface-card p-4">
        <span class="text-sm text-neutral-500 dark:text-neutral-400"
          >Ingresos ({{ days() }} días)</span
        >
        <div class="text-2xl font-semibold text-brand-700 dark:text-brand-400">
          {{ totalRevenue() }} EUR
        </div>
      </div>
      <div class="surface-card p-4">
        <span class="text-sm text-neutral-500 dark:text-neutral-400"
          >Pedidos ({{ days() }} días)</span
        >
        <div class="text-2xl font-semibold text-neutral-900 dark:text-white">
          {{ totalOrders() }}
        </div>
      </div>
      <div class="surface-card p-4">
        <span class="text-sm text-neutral-500 dark:text-neutral-400"
          >Media diaria</span
        >
        <div class="text-2xl font-semibold text-neutral-900 dark:text-white">
          {{ avgRevenuePerDay() }} EUR
        </div>
      </div>
    </div>

    <div class="viz-root mb-6 p-4">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-semibold" style="color: var(--text-primary)">
          Ingresos por día
        </h3>
        <button class="secondary-button px-3 py-1" (click)="toggleSalesTable()">
          {{ showSalesTable() ? 'Ver gráfico' : 'Ver tabla' }}
        </button>
      </div>

      @if (salesByDay().length < 1) {
      <span style="color: var(--text-secondary)"
        >No hay pedidos en este periodo</span
      >
      } @else if (showSalesTable()) {
      <table class="w-full text-left">
        <thead>
          <tr style="color: var(--text-secondary)">
            <th class="pb-1">Día</th>
            <th class="pb-1">Ingresos</th>
            <th class="pb-1">Pedidos</th>
          </tr>
        </thead>
        <tbody style="color: var(--text-primary)">
          @for (point of salesByDay(); track point.day) {
          <tr>
            <td>{{ point.day }}</td>
            <td>{{ point.revenue }} EUR</td>
            <td>{{ point.orders }}</td>
          </tr>
          }
        </tbody>
      </table>
      } @else {
      <div
        class="relative"
        [style.aspect-ratio]="chartWidth + '/' + chartHeight">
        <svg
          [attr.viewBox]="'0 0 ' + chartWidth + ' ' + chartHeight"
          class="h-full w-full">
          @for (tick of yTicks(); track tick.value) {
          <line
            [attr.x1]="padding.left"
            [attr.x2]="chartWidth - padding.right"
            [attr.y1]="tick.y"
            [attr.y2]="tick.y"
            stroke="var(--gridline)"
            stroke-width="1" />
          <text
            [attr.x]="padding.left - 8"
            [attr.y]="tick.y"
            text-anchor="end"
            dominant-baseline="middle"
            style="fill: var(--text-muted); font-size: 10px">
            {{ tick.value }}
          </text>
          }

          <polyline
            [attr.points]="linePoints()"
            fill="none"
            stroke="var(--series-1)"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round" />

          @if (areaPath()) {
          <path
            [attr.d]="areaPath()"
            fill="var(--series-1-wash)"
            stroke="none" />
          } @for (point of chartPoints(); track point.data.day) {
          <circle
            [attr.cx]="point.x"
            [attr.cy]="point.y"
            r="4"
            stroke="var(--surface-1)"
            stroke-width="2"
            fill="var(--series-1)"
            tabindex="0"
            (mouseenter)="hoveredPoint.set(point)"
            (mouseleave)="hoveredPoint.set(null)"
            (focus)="hoveredPoint.set(point)"
            (blur)="hoveredPoint.set(null)" />
          } @if (lastPoint(); as last) { @if (hoveredPoint()?.data?.day !==
          last.data.day) {
          <text
            [attr.x]="last.x"
            [attr.y]="last.y - 10"
            text-anchor="end"
            style="fill: var(--text-primary); font-size: 11px; font-weight: 600">
            {{ last.data.revenue }} EUR
          </text>
          } }
        </svg>

        @if (hoveredPoint(); as hovered) {
        <div
          class="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded px-2 py-1 text-xs shadow"
          style="background: var(--surface-1); color: var(--text-primary); border: 1px solid var(--gridline)"
          [style.left.%]="(hovered.x / chartWidth) * 100"
          [style.top.%]="(hovered.y / chartHeight) * 100 - 2">
          <div class="font-semibold">{{ hovered.data.revenue }} EUR</div>
          <div style="color: var(--text-secondary)">
            {{ hovered.data.day }} · {{ hovered.data.orders }} pedidos
          </div>
        </div>
        }
      </div>
      }
    </div>

    <div class="viz-root p-4">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-semibold" style="color: var(--text-primary)">
          Productos más pedidos
        </h3>
        <button
          class="secondary-button px-3 py-1"
          (click)="toggleTopItemsTable()">
          {{ showTopItemsTable() ? 'Ver gráfico' : 'Ver tabla' }}
        </button>
      </div>

      @if (topItems().length < 1) {
      <span style="color: var(--text-secondary)">No hay pedidos todavía</span>
      } @else if (showTopItemsTable()) {
      <table class="w-full text-left">
        <thead>
          <tr style="color: var(--text-secondary)">
            <th class="pb-1">Producto</th>
            <th class="pb-1">Cantidad</th>
          </tr>
        </thead>
        <tbody style="color: var(--text-primary)">
          @for (item of topItems(); track item.itemId) {
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
          }
        </tbody>
      </table>
      } @else {
      <div [style.aspect-ratio]="barChartWidth + '/' + topItemsChartHeight()">
        <svg
          [attr.viewBox]="'0 0 ' + barChartWidth + ' ' + topItemsChartHeight()"
          class="h-full w-full">
          @for (bar of topItemBars(); track bar.item.itemId) {
          <text
            [attr.x]="barPadding.left - 8"
            [attr.y]="bar.y + barHeight / 2"
            text-anchor="end"
            dominant-baseline="middle"
            style="fill: var(--text-primary); font-size: 12px">
            {{ bar.item.name }}
          </text>
          <rect
            [attr.x]="barPadding.left"
            [attr.y]="bar.y"
            [attr.width]="bar.width"
            [attr.height]="barHeight"
            rx="4"
            fill="var(--series-1)"
            tabindex="0"
            (mouseenter)="hoveredBar.set(bar.item.itemId)"
            (mouseleave)="hoveredBar.set(null)"
            (focus)="hoveredBar.set(bar.item.itemId)"
            (blur)="hoveredBar.set(null)"
            [attr.opacity]="hoveredBar() === bar.item.itemId ? 0.8 : 1" />
          <text
            [attr.x]="barPadding.left + bar.width + 6"
            [attr.y]="bar.y + barHeight / 2"
            dominant-baseline="middle"
            style="fill: var(--text-primary); font-size: 12px; font-weight: 600">
            {{ bar.item.quantity }}
          </text>
          }
        </svg>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .viz-root {
        --surface-1: #fcfcfb;
        --text-primary: #0b0b0b;
        --text-secondary: #52514e;
        --text-muted: #898781;
        --gridline: #e1e0d9;
        --series-1: #2a78d6;
        --series-1-wash: rgba(42, 120, 214, 0.1);
        background: var(--surface-1);
        border: 1px solid var(--gridline);
        border-radius: 1rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }
      :host-context(.dark) .viz-root {
        --surface-1: #27272a;
        --text-primary: #ffffff;
        --text-secondary: #c3c2b7;
        --text-muted: #898781;
        --gridline: #3f3f46;
        --series-1: #3987e5;
        --series-1-wash: rgba(57, 135, 229, 0.14);
      }
    `,
  ],
})
export class MetricsDashboardComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  salesByDay = toSignal(this.store.select(selectSalesByDay), {
    initialValue: [],
  });
  topItems = toSignal(this.store.select(selectTopItems), { initialValue: [] });

  readonly dayRanges = DAY_RANGES;
  days = signal<number>(30);
  showSalesTable = signal(false);
  showTopItemsTable = signal(false);
  hoveredPoint = signal<ChartPoint | null>(null);
  hoveredBar = signal<string | null>(null);

  readonly chartWidth = CHART_WIDTH;
  readonly chartHeight = CHART_HEIGHT;
  readonly padding = CHART_PADDING;
  readonly barChartWidth = BAR_CHART_WIDTH;
  readonly barHeight = BAR_HEIGHT;
  readonly barPadding = BAR_PADDING;

  totalRevenue = computed(() =>
    this.salesByDay().reduce((sum, point) => sum + point.revenue, 0)
  );
  totalOrders = computed(() =>
    this.salesByDay().reduce((sum, point) => sum + point.orders, 0)
  );
  avgRevenuePerDay = computed(() => {
    const points = this.salesByDay();
    return points.length > 0
      ? Math.round(this.totalRevenue() / points.length)
      : 0;
  });

  private maxRevenue = computed(() =>
    Math.max(...this.salesByDay().map(point => point.revenue), 1)
  );

  private innerWidth = this.chartWidth - this.padding.left - this.padding.right;
  private innerHeight =
    this.chartHeight - this.padding.top - this.padding.bottom;

  chartPoints = computed<ChartPoint[]>(() => {
    const data = this.salesByDay();
    if (data.length === 0) {
      return [];
    }
    const stepX = data.length > 1 ? this.innerWidth / (data.length - 1) : 0;
    const maxRevenue = this.maxRevenue();
    return data.map((point, index) => ({
      x: this.padding.left + index * stepX,
      y:
        this.padding.top +
        this.innerHeight -
        (point.revenue / maxRevenue) * this.innerHeight,
      data: point,
    }));
  });

  linePoints = computed(() =>
    this.chartPoints()
      .map(point => `${point.x},${point.y}`)
      .join(' ')
  );

  areaPath = computed(() => {
    const points = this.chartPoints();
    if (points.length === 0) {
      return '';
    }
    const baseline = this.padding.top + this.innerHeight;
    const top = points.map(point => `${point.x},${point.y}`).join(' L ');
    const last = points[points.length - 1];
    const first = points[0];
    return `M ${first.x},${baseline} L ${top} L ${last.x},${baseline} Z`;
  });

  lastPoint = computed(() => {
    const points = this.chartPoints();
    return points.length > 0 ? points[points.length - 1] : null;
  });

  yTicks = computed(() => {
    const max = this.maxRevenue();
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = Math.round((max / steps) * i);
      return {
        value,
        y:
          this.padding.top +
          this.innerHeight -
          (value / max) * this.innerHeight,
      };
    });
  });

  topItemsChartHeight = computed(() => {
    const n = this.topItems().length;
    return (
      this.barPadding.top +
      this.barPadding.bottom +
      n * this.barHeight +
      Math.max(n - 1, 0) * BAR_GAP
    );
  });

  topItemBars = computed(() => {
    const items = this.topItems();
    const maxQuantity = Math.max(...items.map(item => item.quantity), 1);
    const innerWidth =
      this.barChartWidth - this.barPadding.left - this.barPadding.right;
    return items.map((item, index) => ({
      item,
      y: this.barPadding.top + index * (this.barHeight + BAR_GAP),
      width: (item.quantity / maxQuantity) * innerWidth,
    }));
  });

  onDaysChange(days: number) {
    this.days.set(days);
    this.store.dispatch(getSalesByDay({ days }));
  }

  toggleSalesTable() {
    this.showSalesTable.update(shown => !shown);
  }

  toggleTopItemsTable() {
    this.showTopItemsTable.update(shown => !shown);
  }

  ngOnInit() {
    this.store.dispatch(getSalesByDay({ days: this.days() }));
    this.store.dispatch(getTopItems({ limit: TOP_ITEMS_LIMIT }));
  }
}
