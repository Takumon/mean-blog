import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JwtService } from '../../shared/services/jwt.service';
import { ImageModel } from '../../shared/models/image.model';

// 画像は更新なし
@Injectable()
export class ImageService {
  private baseUrl = '/api/images/ofArticle';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) { }

  getAll(): Observable<Array<ImageModel>> {
    const URL = this.baseUrl;

    return this.http.get<Array<ImageModel>>(URL);
  }

  getById(_id: string): Observable<ImageModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.get<ImageModel>(URL, this.jwtService.getRequestOptions());
  }

  create(imageFile: File): Observable<any> {
    const URL = this.baseUrl;

    const headers: HttpHeaders = this.jwtService.getHeaders();

    const body = new FormData();
    body.append('image', imageFile);

    return this.http.request('post', URL, { body, headers });
  }

  delete(_id: string): Observable<any> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete(URL, this.jwtService.getRequestOptions());
  }
}
