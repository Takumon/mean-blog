import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ArticleModel } from './article.model';
import { CommentModel } from './comment.model';
import { JwtService } from '../../shared/services/jwt.service';


@Injectable()
export class ArticleService {
  private baseUrl = '/api/articles';
  private commentUrl = '/api/comments';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  /* 記事 */

  // 複数件取得
  get(condition: Object, withUser: Boolean = false): Observable<any> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
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

  // １件取得
  getOne(_id: string, withUser: Boolean = false): Observable<any> {
    const URL = `${this.baseUrl}/${_id}`;
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

  // 更新
  update(article: ArticleModel): Observable<any> {
    const URL = `${this.baseUrl}/${article._id}`;

    return this.http
      .put(URL, article, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 登録
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

  // 削除
  delete(_id: string): Observable<any> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }


  /* コメント */

  // 複数件取得
  getComment(condition: Object, withUser: Boolean = false): Observable<any> {
    const URL = this.commentUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
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

  // 登録
  registerComment(comment: CommentModel): Observable<any> {
    const URL = this.commentUrl;

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

  // 更新
  updateComment(comment: CommentModel): Observable<any> {
    const URL = `${this.commentUrl}/${comment._id}`;
    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .put(URL, comment, options)
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  // 削除
  deleteComment(commentId: String): Observable<any> {
    const URL = `${this.commentUrl}/${commentId}`;

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

  /* いいね */

  // 登録
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;
    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
        .post(URL, {'voter': _idOfUser}, options)
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 削除
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // １件取得
  getVoteOne(_idOfArticle: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http
        .get(URL, this.jwtService.getRequestOptions())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
