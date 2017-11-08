import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { JwtService } from '../../shared/services/jwt.service';
import { ImageModel } from '../../shared/models/image.model';

// 画像は更新なし
@Injectable()
export class ImageService {
  private baseUrl = '/api/images/ofArticle';

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) { }

  getAll(): Observable<Array<ImageModel>> {
    const URL = this.baseUrl;

    return this.http
      .get(URL)
      .map((res: Response) => res.json() as Array<ImageModel>)
      .catch((res: Response) => Observable.throw(res.json()));
  }

  getById(_id: string): Observable<ImageModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json() as ImageModel)
      .catch((res: Response) => Observable.throw(res.json()));
  }

  create(imageFile: File): Observable<any> {
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    headers.delete('Content-Type');
    const options = new RequestOptions({ headers: headers });


    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http
      .request(URL, {
        method: 'post',
        body: formData,
        headers: options.headers
      });
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((res: Response) => Observable.throw(res.json()));
  }
}
