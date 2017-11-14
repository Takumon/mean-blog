import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
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
    private httpClient: HttpClient,
    private jwtService: JwtService
  ) {}

  // 複数件取得
  get(condition: Object, withUser: Boolean = false): Observable<Array<ArticleModel | ArticleWithUserModel>> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeadersNew();
    const params = new HttpParams();
    params.set('condition', JSON.stringify(condition));
    if (withUser) {
      params.set('withUser', `true`);
    }

    return this.httpClient
        .get<Array<ArticleModel | ArticleWithUserModel>>(URL, { headers, params });
  }

  // １件取得
  getOne(_id: string, withUser: Boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
    const URL = `${this.baseUrl}/${_id}`;
    const headers = this.jwtService.getHeadersNew();
    const params = new HttpParams().set('withUser', '' + withUser);

    return this.httpClient
        .get<ArticleModel | ArticleWithUserModel>(URL, { headers, params });
  }

  // 更新
  update(article: ArticleModel): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${article._id}`;

    return this.httpClient
      .put<ArticleModel>(URL, article, this.jwtService.getRequestOptionsNew());
  }

  // 登録
  register(article: ArticleModel): Observable<ArticleModel> {
    const URL = this.baseUrl;

    return this.httpClient
      .post<ArticleModel>(URL, article, this.jwtService.getRequestOptionsNew());
  }

  // 削除
  delete(_id: string): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.httpClient
        .delete<ArticleModel>(URL, this.jwtService.getRequestOptionsNew());
  }


  /* いいね */

  // 登録
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;
    const headers: HttpHeaders = this.jwtService.getHeadersNew();
    headers.set('Content-Type', this.Constant.POST_CONTENT_TYPE);

    return this.httpClient
        .post(URL, {'voter': _idOfUser}, { headers });
  }

  // 削除
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.httpClient
        .delete(URL, this.jwtService.getRequestOptionsNew());
  }

  // １件取得
  getVoteOne(_idOfArticle: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.httpClient
        .get(URL, this.jwtService.getRequestOptionsNew());
  }
}
