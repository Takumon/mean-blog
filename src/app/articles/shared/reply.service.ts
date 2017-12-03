import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ReplyModel } from './reply.model';
import { ReplyWithUserModel } from './reply-with-user.model';
import { ReplyWithArticleModel } from './reply-with-article.model';

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
   * コメントを複数件取得
   *
   * @param condition 検索条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle  取得情報に元記事情報を付与するか
   * @return 指定した検索条件に一致するコメント情報リスト
   */
  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel> | Array<ReplyWithArticleModel>> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ condition, withUser, withArticle });

    return this.http.get<Array<ReplyModel> | Array<ReplyWithUserModel>>(URL, options);
  }

  /**
   * コメントを一件取得
   *
   * @param _id 取得対象のコメントの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 指定した_idに一致するコメント情報
   */
  getById(_id: string, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.get<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel>(URL, options);
  }

  /**
   * コメントを登録
   *
   * @param reply 登録するコメントモデル
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 登録後のコメント情報
   */
  register(reply: ReplyModel, withUser: boolean = false , withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.post<ReplyModel | ReplyWithUserModel>(URL, reply, options);
  }

  /**
   * コメントを更新（差分更新）
   *
   * @param reply 更新するコメントモデル(更新対象のプロパティのみ定義したモデル)
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 更新後のコメント情報
   */
  update(reply: ReplyModel, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${reply._id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.put<ReplyModel | ReplyWithUserModel>(URL, reply, options);
  }

  /**
   * コメントを削除（論理削除）
   *
   * @param _id 削除対象のコメントの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 削除したコメント情報
   */
  delete(replyId: String, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
    const URL = `${this.baseUrl}/${replyId}`;

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
