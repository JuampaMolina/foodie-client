import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UploadSignature } from '../interface/uploadSignature';

const uploadSignatureApi = environment.apiBaseUri + '/uploads/signature';

interface CloudinaryUploadResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryImageUploadService {
  private http = inject(HttpClient);

  upload(file: File): Observable<string> {
    return this.http.get<UploadSignature>(uploadSignatureApi).pipe(
      switchMap(signature => this.uploadToCloudinary(file, signature)),
      map(response => response.secure_url)
    );
  }

  // Petición aparte a un dominio ajeno (no pasa por nuestro backend): el
  // authInterceptor está pensado justo para no adjuntar aquí el JWT.
  private uploadToCloudinary(
    file: File,
    signature: UploadSignature
  ): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;
    return this.http.post<CloudinaryUploadResponse>(uploadUrl, formData);
  }
}
