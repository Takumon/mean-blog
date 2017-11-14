import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ArticleModel } from './article.model';
import { ArticleWithUserModel } from './article-with-user.model';
import { CommentModel } from './comment.model';


@Injectable()
export class ArticleService {
  private Constant = Constant;
  private baseUrl = '/api/articles';
  private commentUrl = '/api/comments';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  // 複数件取得
  get(condition: Object, withUser: Boolean = false): Observable<Array<ArticleModel | ArticleWithUserModel>> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }

  // １件取得
  getOne(_id: string, withUser: Boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
    const URL = `${this.baseUrl}/${_id}`;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }

  // 更新
  update(article: ArticleModel): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${article._id}`;

    return this.http
      .put(URL, article, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 登録
  register(article: ArticleModel): Observable<ArticleModel> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, article, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 削除
  delete(_id: string): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }


  /* いいね */

  // 登録
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;
    const options = {
      'Content-Type': this.Constant.POST_CONTENT_TYPE,
      headers: this.jwtService.getHeaders()
    };

    return this.http
        .post(URL, {'voter': _idOfUser}, options)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }

  // 削除
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }

  // １件取得
  getVoteOne(_idOfArticle: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http
        .get(URL, this.jwtService.getRequestOptions())
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }
}
