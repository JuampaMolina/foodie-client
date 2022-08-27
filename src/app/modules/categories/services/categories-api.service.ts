import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Category } from '../interface/category';
import { Observable } from 'rxjs';
import { CreateCategoryCommand } from '../interface/createCategoryCommand';
import { UpdateCategoryCommand } from '../interface/updateCategoryCommand';
import { AuthService } from '../../../shared/services/auth.service';

const categoriesApi = environment.apiBaseUri + '/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(categoriesApi);
  }

  createCategory(category: CreateCategoryCommand): Observable<Category> {
    return this.http.post<Category>(
      categoriesApi,
      category,
      this.auth.getHeaders()
    );
  }

  updateCategory(categoryUpdate: UpdateCategoryCommand): Observable<Category> {
    const { categoryId, category } = categoryUpdate;
    const url = categoriesApi + '/' + categoryId;

    return this.http.put<Category>(url, category, this.auth.getHeaders());
  }

  deleteCategory(categoryId: string): Observable<Category> {
    const url = categoriesApi + '/' + categoryId;
    return this.http.delete<Category>(url, this.auth.getHeaders());
  }
}
