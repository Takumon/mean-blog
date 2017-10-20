import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { JwtService } from '../../shared/services/jwt.service';

import { CommentModel } from './comment.model';

@Injectable()
export class CommentService {
  private baseUrl = '/api/comments';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  get(condition: Object, withUser: Boolean = false, withArticle: Boolean = false): Observable<any> {
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    return this.http
      .get(URL, { headers, search })
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(comment: CommentModel): Observable<any> {
    const URL = this.baseUrl;

    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .post(URL, comment, options)
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  // 必ず差分更新とする
  update(comment: CommentModel): Observable<any> {
    const URL = `${this.baseUrl}/${comment._id}`;

    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .put(URL, {$set: comment}, options)
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  delete(commentId: String): Observable<any> {
    const URL = `${this.baseUrl}/${commentId}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }


  getOfArticle(_idOfArticle: string, withUser: Boolean = false): Observable<any> {
    const URL = `${this.baseUrl}/ofArticle/${_idOfArticle}`;

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
}
