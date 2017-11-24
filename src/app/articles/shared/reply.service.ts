import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ReplyModel } from './reply.model';
import { ReplyWithUserModel } from './reply-with-user.model';
import { ReplyWithArticleModel } from './reply-with-article.model';


@Injectable()
export class ReplyService {
  private Constant = Constant;
  private baseUrl = '/api/replies';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  // 複数件取得
  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel> | Array<ReplyWithArticleModel>> {
    const URL = this.baseUrl;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    let params = new HttpParams()
      .set('condition', JSON.stringify(condition));
    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.get<Array<ReplyModel> | Array<ReplyWithUserModel>>(URL, { headers, params });
  }

  // 一件取得
  getById(_id: string, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel> | Array<ReplyWithArticleModel>> {
    const URL = `${this.baseUrl}/${_id}`;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.get<Array<ReplyModel> | Array<ReplyWithUserModel>>(URL, { headers, params });
  }

  // 登録
  register(reply: ReplyModel, withUser: boolean = false , withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = this.baseUrl;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.post<ReplyModel | ReplyWithUserModel>(URL, reply,  { headers, params });
  }

  // 更新（差分更新）
  update(reply: ReplyModel, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${reply._id}`;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.put<ReplyModel | ReplyWithUserModel>(URL, reply,  { headers, params });
  }

  // 物理削除
  delete(replyId: String, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${replyId}`;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.delete<ReplyModel | ReplyWithUserModel>(URL, { headers, params });
  }
}
