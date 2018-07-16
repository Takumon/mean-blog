import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { CommentModel } from './comment.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentWithArticleModel } from './comment-with-article.model';

/**
 * Http通信用オプション
 */
interface HttpOption {
  condition?: Object;
  withUser: boolean;
  withArticle: boolean;
}

/**
 * コメント情報のサービスクラス
 */
@Injectable()
export class CommentService {
  /** 定数クラス */
  private Constant = Constant;

  /** 本サービスのベースURL */
  private baseUrl = '/api/comments';

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
   * @return 指定した検索条件に一致するコメント情報リスト
   */
  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ condition, withUser, withArticle });

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>>(URL, options);
  }

  /**
   * 登録
   *
   * @param model 登録するモデル
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 登録後のモデル
   */
  register(model: CommentModel, withUser: boolean = false , withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = this.baseUrl;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.post<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, model, options);
  }

  /**
   * 更新（差分更新）
   *
   * @param model 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 更新後のモデル
   */
  update(model: CommentModel, withUser: boolean = false, withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.put<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, model, options);
  }

  /**
   * 削除（論理削除）
   *
   * @param _id 削除対象モデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 削除したモデル
   */
  delete(_id: string, withUser: boolean = false, withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.delete<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, options);
  }


  /**
   * 複数件検索(指定した記事に紐付くモデルを取得する)
   *
   * @param _idOfArticle 紐付く記事の_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @param withArticle 取得情報に元記事情報を付与するか
   * @return 指定した記事に紐付くモデルのリスト
   */
  getOfArticle(_idOfArticle: string, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel>> {
    const URL = `${this.baseUrl}/ofArticle/${_idOfArticle}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel>>(URL, options);
  }


  /**
   * 指定したコメントリストから削除していないコメントとリプライの件数を返す
   *
   * @param comments コメントリスト
   * @return 指定したコメントリストのうち削除していないコメントとリプライの件数
   */
  count(comments: Array<CommentWithUserModel>): number {
    if (!comments || comments.length === 0) {
      return 0;
    }

    return comments
      .filter(comment => !comment.deleted) // コメントは論理削除しているものを除外
      .map(comment => {
        // コメント自身の件数
        let count = 1;
        // リプライは論理削除がないのでそのまま加算する
        count += comment.replies ? comment.replies.length : 0;
        return count;
      })
      .reduce((a, b) => a + b, 0);
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
