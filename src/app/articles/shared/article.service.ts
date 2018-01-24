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

/**
 * Http通信用オプション
 */
interface HttpOption {
  condition?: Object;
  withUser?: boolean;
  withArticle?: boolean;
}

@Injectable()
export class ArticleService {
  private Constant = Constant;
  private baseUrl = '/api/articles';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param paginOptions ページング条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した検索条件とページング条件に一致するモデルのリスト
   */
  get(condition: Object, paginOptions: {skip?: number, limit?: number, sort?: Object}, withUser: boolean = false): Observable<{count: number, articles: Array<ArticleModel | ArticleWithUserModel>}> {
    const URL = this.baseUrl;

    // 検索条件にページング条件をマージする
    const options = this.constructOptions({ condition: Object.assign({}, condition, paginOptions), withUser });

    return this.http.get<{count: number, articles: Array<ArticleModel | ArticleWithUserModel>}>(URL, options);
  }


  /**
   * 一件取得
   * @param _id 取得するモデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した_idに一致するモデル
   */
  getById(_id: string, withUser: boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser });

    return this.http.get<ArticleModel | ArticleWithUserModel>(URL, options);
  }

  /**
   * 登録
   *
   * @param model 登録するモデル
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 登録後のモデル
   */
  update(model: ArticleModel, withUser: boolean = false): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    const options = this.constructOptions({ withUser });

    return this.http.put<ArticleModel>(URL, model, options);
  }

  /**
   * 更新（差分更新）
   *
   * @param model 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 更新後のモデル
   */
  register(model: ArticleModel, withUser: boolean = false): Observable<ArticleModel> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ withUser });

    return this.http.post<ArticleModel>(URL, model, options);
  }

  /**
   * 削除（論理削除）
   *
   * @param _id 削除対象モデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 削除したモデル
   */
  delete(_id: string, withUser: boolean = false): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser });

    return this.http.delete<ArticleModel>(URL, options);
  }



  /**
   * いいね登録
   *
   * @param _idOfArticle いいねの対象記事の_id
   * @param _idOfUser いいねをするユーザの_id
   */
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http.post(URL, {'voter': _idOfUser}, this.jwtService.getRequestOptions());
  }

  /**
   * いいね削除
   *
   * @param _idOfArticle いいねの対象記事の_id
   * @param _idOfUser いいねをするユーザの_id
   */
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.http.delete(URL, this.jwtService.getRequestOptions());
  }

  /**
   * 指定した記事_idに紐づくいいねを検索
   *
   * @param _idOfArticle 記事_id
   */
  getVote(_idOfArticle: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http.get(URL, this.jwtService.getRequestOptions());
  }

  /**
   * 指定した引数を元にHttp通信用オプションを生成する
   *
   * @param httpOption
   * @return http通信用オプション
   */
  private constructOptions(httpOption: HttpOption): {params: HttpParams, headers: HttpHeaders} {
    const headers = this.jwtService.getHeaders();
    let params = new HttpParams();

    if (httpOption.condition) {
      params = params.set('condition', JSON.stringify(httpOption.condition));
    }

    if (httpOption.withUser) {
      params = params.set('withUser', 'true');
    }

    if (httpOption.withArticle) {
      params = params.set('withArticle', 'true');
    }

    return { headers, params };
  }
}
