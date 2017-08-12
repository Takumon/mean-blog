import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ArticleModel } from './article.model';
import { JwtService } from '../../shared/services/jwt.service';

@Injectable()
export class ArticleService {
  private baseUrl = '/api/articles';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  getAll(withUser: Boolean = false): Observable<any> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  get(id: number, withUser: Boolean = false): Observable<any> {
    const URL = `${this.baseUrl}/${id}`;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  update(article: ArticleModel): Observable<any> {
    const URL = `${this.baseUrl}/${article.articleId}`;

    return this.http
      .put(URL, article, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(article: ArticleModel): Observable<any> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, article, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  delete(id: number): Observable<any> {
    const URL = `${this.baseUrl}/${id}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
