import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Item } from '../interface/item';
import { ItemsApiService } from './items-api.service';

describe('ItemsApiService', () => {
  let service: ItemsApiService;
  let httpMock: HttpTestingController;

  const itemsApi = environment.apiBaseUri + '/items';
  const item: Item = { _id: '1', name: 'Pizza', description: '', price: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ItemsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET all items', () => {
    service.getItems().subscribe(items => {
      expect(items).toEqual([item]);
    });

    const req = httpMock.expectOne(itemsApi);
    expect(req.request.method).toBe('GET');
    req.flush([item]);
  });

  it('should GET items by category id', () => {
    service.getItemsByCategoryId('cat-1').subscribe(items => {
      expect(items).toEqual([item]);
    });

    const req = httpMock.expectOne(itemsApi + '/category/cat-1');
    expect(req.request.method).toBe('GET');
    req.flush([item]);
  });

  it('should POST a new item', () => {
    const newItem = {
      name: 'Pizza',
      description: '',
      price: 10,
      category: 'cat-1',
    };
    service.createItem(newItem).subscribe(result => {
      expect(result).toEqual(item);
    });

    const req = httpMock.expectOne(itemsApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(item);
  });

  it('should PUT an updated item', () => {
    const updated = {
      name: 'Pizza grande',
      description: '',
      price: 12,
      category: 'cat-1',
    };
    service.updateItem({ itemId: '1', item: updated }).subscribe(result => {
      expect(result).toEqual(item);
    });

    const req = httpMock.expectOne(itemsApi + '/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush(item);
  });

  it('should DELETE an item', () => {
    service.deleteItem('1').subscribe(result => {
      expect(result).toEqual(item);
    });

    const req = httpMock.expectOne(itemsApi + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(item);
  });
});
