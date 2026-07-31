import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { TopItem } from '../interface/topItem';
import { MetricsApiService } from './metrics-api.service';

describe('MetricsApiService', () => {
  let service: MetricsApiService;
  let httpMock: HttpTestingController;

  const metricsApi = environment.apiBaseUri + '/metrics';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MetricsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET sales by day with a days param', () => {
    const salesByDay: SalesByDayPoint[] = [
      { day: '2026-07-30', revenue: 60, orders: 8 },
    ];
    service.getSalesByDay(7).subscribe(result => {
      expect(result).toEqual(salesByDay);
    });

    const req = httpMock.expectOne(
      req => req.url === metricsApi + '/sales-by-day'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('days')).toBe('7');
    req.flush(salesByDay);
  });

  it('should GET sales by day without a days param when omitted', () => {
    service.getSalesByDay().subscribe();

    const req = httpMock.expectOne(
      req => req.url === metricsApi + '/sales-by-day'
    );
    expect(req.request.params.has('days')).toBeFalse();
    req.flush([]);
  });

  it('should GET top items with a limit param', () => {
    const topItems: TopItem[] = [{ itemId: '1', name: 'Pizza', quantity: 5 }];
    service.getTopItems(5).subscribe(result => {
      expect(result).toEqual(topItems);
    });

    const req = httpMock.expectOne(
      req => req.url === metricsApi + '/top-items'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('5');
    req.flush(topItems);
  });
});
