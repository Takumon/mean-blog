import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';

import { ArticleModel } from './article.model';
import { ArticleWithUserModel } from './article-with-user.model';
import { UserModel } from '../../users/shared/user.model';


/**
 * 登録(Create)、更新(Update)、削除時(delete)のレスポンス
 */
interface CudResponse {
  message: string;
  obj: ArticleModel;
}

/**
 * いいねの登録(Create)、更新(Update)、削除時(delete)のレスポンス
 */
export interface VoteCudResponse {
  message: string;
  obj: string[];
}


/**
 * 検索条件を複数件取得する際の検索条件
 */
export interface Condition {
  author?: {
    _id?: string | string[];
    userId?: string | string[];
  };
  dateFrom?: string;
  dateTo?: string;
  voter?: string | string[];
}

/**
 * 検索時のページング、ソート条件
 */
export interface PageAndSortOption {
  skip?: number;
  limit?: number;
  sort?: Object;
}

/**
 * Http通信用オプション
 */
interface HttpOption {
  condition?: Condition;
  withUser?: boolean;
}

@Injectable()
export class ArticleService {
  private Constant = Constant;
  private baseUrl = '/api/articles';

  constructor(
    private http: HttpClient,
  ) {}

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param paginAndSortOptions ページング条件とソート条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した検索条件とページング条件に一致するモデルのリスト
   */
  get(
    condition: Condition,
    paginAndSortOptions: PageAndSortOption,
    withUser: boolean = false): Observable<{count: number, articles: Array<ArticleModel | ArticleWithUserModel>}> {
    const URL = this.baseUrl;

    // 検索条件にページング条件をマージする
    const options = this.constructOptions({ condition: Object.assign({}, condition, paginAndSortOptions), withUser });

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
   * @return 登録後のモデル
   */
  update(model: ArticleModel): Observable<CudResponse> {
    const URL = `${this.baseUrl}/${model._id}`;

    return this.http.put<CudResponse>(URL, model);
  }

  /**
   * 更新（差分更新）
   *
   * @param model 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @return 更新後のモデル
   */
  register(model: ArticleModel): Observable<CudResponse> {
    const URL = this.baseUrl;

    return this.http.post<CudResponse>(URL, model);
  }

  /**
   * 削除（論理削除）
   *
   * @param _id 削除対象モデルの_id
   * @return 削除したモデル
   */
  delete(_id: string): Observable<CudResponse> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<CudResponse>(URL);
  }



  /**
   * いいねを検索
   *
   * @param _idOfArticle 記事_id
   * @param withUser 取得情報にユーザ情報を付与するか
   */
  getVote(_idOfArticle: string, withUser = false): Observable<string[] | UserModel[]> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    const options = this.constructOptions({ withUser });

    return this.http.get<string[]>(URL, options);
  }

  /**
   * いいねを登録
   *
   * @param _idOfArticle いいねの対象記事の_id
   * @param _idOfUser いいねをするユーザの_id
   */
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<VoteCudResponse> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http.post<VoteCudResponse>(URL, {'voter': _idOfUser});
  }

  /**
   * いいねを削除
   *
   * @param _idOfArticle いいねの対象記事の_id
   * @param _idOfUser いいねをするユーザの_id
   */
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<VoteCudResponse> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.http.delete<VoteCudResponse>(URL);
  }


  /**
   * 指定した引数を元にHttp通信用オプションを生成する
   *
   * @param httpOption
   * @return http通信用オプション
   */
  private constructOptions(httpOption: HttpOption): {params: HttpParams} {
    let params = new HttpParams();

    if (httpOption.condition) {
      params = params.set('condition', JSON.stringify(httpOption.condition));
    }

    if (httpOption.withUser) {
      params = params.set('withUser', 'true');
    }

    return { params };
  }
}
