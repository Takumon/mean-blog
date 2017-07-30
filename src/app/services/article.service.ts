import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Article } from '../models/article';

@Injectable()
export class ArticleService {
  private baseUrl = '/api/articles';

  constructor(private http: Http) {}

  getAll(): Observable<any> {
    return this.http
        .get(this.baseUrl)
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  get(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;

    return this.http
        .get(url)
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  update(article: Article): Observable<any> {
    const url = `${this.baseUrl}/${article.articleId}`;

    return this.http
      .put(url, article)
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
