import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Category } from '../interface/category';
import { CategoriesApiService } from './categories-api.service';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let httpMock: HttpTestingController;

  const categoriesApi = environment.apiBaseUri + '/categories';
  const category: Category = { _id: '1', name: 'Bebidas' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET all categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories).toEqual([category]);
    });

    const req = httpMock.expectOne(categoriesApi);
    expect(req.request.method).toBe('GET');
    req.flush([category]);
  });

  it('should POST a new category', () => {
    service.createCategory({ name: 'Bebidas' }).subscribe(result => {
      expect(result).toEqual(category);
    });

    const req = httpMock.expectOne(categoriesApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Bebidas' });
    req.flush(category);
  });

  it('should PUT an updated category', () => {
    service
      .updateCategory({ categoryId: '1', category: { name: 'Bebidas frías' } })
      .subscribe(result => {
        expect(result).toEqual(category);
      });

    const req = httpMock.expectOne(categoriesApi + '/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Bebidas frías' });
    req.flush(category);
  });

  it('should DELETE a category', () => {
    service.deleteCategory('1').subscribe(result => {
      expect(result).toEqual(category);
    });

    const req = httpMock.expectOne(categoriesApi + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(category);
  });
});
