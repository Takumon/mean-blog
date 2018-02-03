import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ImageModel } from '../../shared/models/image.model';

// 画像は更新なし
@Injectable()
export class ImageService {
  private baseUrl = '/api/images/ofArticle';

  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<ImageModel[]> {
    const URL = this.baseUrl;

    return this.http.get<ImageModel[]>(URL);
  }

  getById(_id: string): Observable<ImageModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.get<ImageModel>(URL);
  }

  register(imageFile: File): Observable<any> {
    const URL = this.baseUrl;

    const body = new FormData();
    body.append('image', imageFile);

    return this.http.request('post', URL, { body });
  }

  delete(_id: string): Observable<any> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete(URL);
  }
}
