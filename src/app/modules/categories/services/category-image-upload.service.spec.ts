import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { UploadSignature } from '../interface/uploadSignature';
import { CategoryImageUploadService } from './category-image-upload.service';

describe('CategoryImageUploadService', () => {
  let service: CategoryImageUploadService;
  let httpMock: HttpTestingController;

  const signatureApi = environment.apiBaseUri + '/uploads/signature';
  const signature: UploadSignature = {
    timestamp: 1234,
    folder: 'foodie/categories',
    signature: 'abc123',
    apiKey: 'key',
    cloudName: 'demo-cloud',
  };
  const file = new File(['x'], 'icon.png', { type: 'image/png' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoryImageUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('gets a signature and uploads the file directly to Cloudinary with it', () => {
    let result: string | undefined;
    service.upload(file).subscribe(url => (result = url));

    const signatureReq = httpMock.expectOne(signatureApi);
    expect(signatureReq.request.method).toBe('GET');
    signatureReq.flush(signature);

    const uploadReq = httpMock.expectOne(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`
    );
    expect(uploadReq.request.method).toBe('POST');
    const body = uploadReq.request.body as FormData;
    expect(body.get('file')).toBe(file);
    expect(body.get('api_key')).toBe(signature.apiKey);
    expect(body.get('timestamp')).toBe(String(signature.timestamp));
    expect(body.get('signature')).toBe(signature.signature);
    expect(body.get('folder')).toBe(signature.folder);

    uploadReq.flush({
      secure_url:
        'https://res.cloudinary.com/demo-cloud/image/upload/v1/foodie/categories/icon.png',
    });

    expect(result).toBe(
      'https://res.cloudinary.com/demo-cloud/image/upload/v1/foodie/categories/icon.png'
    );
  });
});
