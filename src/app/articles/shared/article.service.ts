import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
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

  getAll(): Observable<any> {
    return this.http
        .get(this.baseUrl, this.jwtService.jwt())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  get(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;

    return this.http
        .get(url, this.jwtService.jwt())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  update(article: ArticleModel): Observable<any> {
    const url = `${this.baseUrl}/${article.articleId}`;

    return this.http
      .put(url, article, this.jwtService.jwt())
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
      }, this.jwtService.jwt())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;

    return this.http
        .delete(url, this.jwtService.jwt())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
