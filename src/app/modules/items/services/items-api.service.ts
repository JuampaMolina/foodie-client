import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { Item } from '../interface/item';
import { Observable } from 'rxjs';

const itemsApi = environment.apiBaseUri + '/items'

@Injectable({
  providedIn: 'root'
})
export class ItemsApiService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(itemsApi);
  }

  createItem(item: Item) {
    return this.http.post(itemsApi, item)
  }
}
