import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateItemCommand } from '../interface/createItemCommand';
import { Item } from '../interface/item';
import { UpdateItemCommand } from '../interface/updateItemCommand';

const itemsApi = environment.apiBaseUri + '/items';

@Injectable({
  providedIn: 'root',
})
export class ItemsApiService {
  private http = inject(HttpClient);

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(itemsApi);
  }

  getItemsByCategoryId(categoryId: string): Observable<Item[]> {
    const url = itemsApi + '/category/' + categoryId;
    return this.http.get<Item[]>(url);
  }

  createItem(item: CreateItemCommand): Observable<Item> {
    return this.http.post<Item>(itemsApi, item);
  }

  updateItem(itemUpdate: UpdateItemCommand): Observable<Item> {
    const { itemId, item } = itemUpdate;
    const url = itemsApi + '/' + itemId;

    return this.http.put<Item>(url, item);
  }

  deleteItem(itemId: string): Observable<Item> {
    const url = itemsApi + '/' + itemId;
    return this.http.delete<Item>(url);
  }
}
