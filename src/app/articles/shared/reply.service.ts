import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ReplyModel } from './reply.model';
import { ReplyWithUserModel } from './reply-with-user.model';


@Injectable()
export class ReplyService {
  private Constant = Constant;
  private baseUrl = '/api/replies';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  // 複数件取得
  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel>> {
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

    const options = {
      headers, search
    };

    return this.http
      .get(URL, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 一件取得
  getById(_id: string, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel>> {
    const URL = `${this.baseUrl}/${_id}`;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    const options = {
      headers, search
    };

    return this.http
      .get(URL, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 登録
  register(reply: ReplyModel, withUser: boolean = false , withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel> {
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    const options = {
      'Content-Type': this.Constant.POST_CONTENT_TYPE,
      headers,
      search,
    };

    return this.http
      .post(URL, reply, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 更新（差分更新）
  update(reply: ReplyModel, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel> {
    const URL = `${this.baseUrl}/${reply._id}`;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    const options = {
      'Content-Type': this.Constant.POST_CONTENT_TYPE,
      headers,
      search,
    };

    return this.http
      .put(URL, reply, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 物理削除
  delete(replyId: String, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel> {
    const URL = `${this.baseUrl}/${replyId}`;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    const options = {
      headers,
      search,
    };

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
