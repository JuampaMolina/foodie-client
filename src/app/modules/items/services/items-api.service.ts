import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { Item } from '../interface/item';
import { Observable } from 'rxjs';
import { CreateItemCommand } from '../interface/createItemCommand';

const itemsApi = environment.apiBaseUri + '/items'

@Injectable({
  providedIn: 'root'
})
export class ItemsApiService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(itemsApi);
  }

  createItem(item: CreateItemCommand) {
    return this.http.post(itemsApi, item)
  }

  getItemsByCategoryId(categoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(itemsApi + `/category/${categoryId}`)
  }

  addCategoryToItem(categoryId: string, itemId: string) {
    return this.http.put(itemsApi + '/category', { categoryId, itemId })
  }
}
