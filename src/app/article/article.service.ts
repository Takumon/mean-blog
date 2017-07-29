import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class ArticleService {

  constructor(private http: Http) {}

  getAll(): Observable<any> {
    return this.http
        .get('/api/articles')
        .map((response: Response) => {
            const result = response.json();
            return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(title: string, body: string): Observable<any> {
    return this.http
      .post('/api/articles', {
        title: title,
        body: body
      })
      .map((response: Response) => {
            const result = response.json();
            return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
