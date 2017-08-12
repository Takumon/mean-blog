import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


/**
 * アイコン生成
 */
@Injectable()
export class IconGeneratorService {
  private baseUrl = '/api/authenticate';

  constructor(
    public http: Http,
  ) { }


  getGravatarImage(userId): Observable<any> {
    const URL = `${this.baseUrl}/generate-icon`;


    const search = new URLSearchParams();
    search.set('userId', userId);

    return this.http
      .get(URL, { search })
      .map(res => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
