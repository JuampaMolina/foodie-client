import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SalesByDayPoint } from '../interface/salesByDayPoint';
import { TopItem } from '../interface/topItem';

const metricsApi = environment.apiBaseUri + '/metrics';

@Injectable({
  providedIn: 'root',
})
export class MetricsApiService {
  private http = inject(HttpClient);

  getSalesByDay(days?: number): Observable<SalesByDayPoint[]> {
    return this.http.get<SalesByDayPoint[]>(metricsApi + '/sales-by-day', {
      params: days ? { days } : {},
    });
  }

  getTopItems(limit?: number): Observable<TopItem[]> {
    return this.http.get<TopItem[]>(metricsApi + '/top-items', {
      params: limit ? { limit } : {},
    });
  }
}
