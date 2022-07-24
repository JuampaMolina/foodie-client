import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { Category } from '../interface/category';
import { Observable } from 'rxjs';

const categoriesApi = environment.apiBaseUri + '/categories'

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(categoriesApi);
  }

  createCategory(category: string) {
    return this.http.post(categoriesApi, category)
  }
}
