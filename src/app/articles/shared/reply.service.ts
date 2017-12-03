import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ReplyModel } from './reply.model';
import { ReplyWithUserModel } from './reply-with-user.model';
import { ReplyWithArticleModel } from './reply-with-article.model';

/**
 * Http通信用オプション
 */
interface HttpOption {
  condition?: Object;
  withUser: boolean;
  withArticle: boolean;
}

/**
 * リプライ情報のサービスクラス
 */
@Injectable()
export class ReplyService {
  /** 定数クラス */
  private Constant = Constant;

  /** 本サービスのベースURL */
  private baseUrl = '/api/replies';

  /** コンストラクタ */
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle  取得情報に元記事情報を付与するか
   * @return 指定した検索条件に一致するモデルのリスト
   */
  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel> | Array<ReplyWithArticleModel>> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ condition, withUser, withArticle });

    return this.http.get<Array<ReplyModel> | Array<ReplyWithUserModel>>(URL, options);
  }

  /**
   * 1件取得
   *
   * @param _id 取得対象モデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 指定した_idに一致するモデル情報
   */
  getById(_id: string, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.get<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel>(URL, options);
  }

  /**
   * 登録
   *
   * @param reply 登録するモデル
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 登録後のモデル
   */
  register(model: ReplyModel, withUser: boolean = false , withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.post<ReplyModel | ReplyWithUserModel>(URL, model, options);
  }

  /**
   * 更新（差分更新）
   *
   * @param reply 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 更新後のモデル
   */
  update(model: ReplyModel, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.put<ReplyModel | ReplyWithUserModel>(URL, model, options);
  }

  /**
   * 削除（論理削除）
   *
   * @param _id 削除対象モデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 削除したモデル
   */
  delete(_id: String, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.delete<ReplyModel | ReplyWithUserModel>(URL, options);
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
