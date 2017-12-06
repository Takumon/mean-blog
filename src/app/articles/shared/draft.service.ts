import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { DraftModel } from './draft.model';

/**
 * 下書き記事情報のサービスクラス
 */
@Injectable()
export class DraftService {
  /** 定数クラス */
  private Constant = Constant;

  /** 本サービスのベースURL */
  private baseUrl = '/api/drafts';

  /** コンストラクタ */
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) { }

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @return 指定した検索条件に一致するモデルのリスト
   */
  get(condition): Observable<Array<DraftModel>> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const params = new HttpParams()
    .set('condition', JSON.stringify(condition));

    return this.http.get<Array<DraftModel>>(URL, { headers, params });
  }

  /**
   * 1件取得
   *
   * @param _id 取得対象モデルの_id
   * @return 指定した_idに一致するモデル情報
   */
  getById(_id: string): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.get<DraftModel>(URL, this.jwtService.getRequestOptions());
  }

  /**
   * 登録
   *
   * @param reply 登録するモデル
   * @return 登録後のモデル
   */
  register(model: DraftModel): Observable<DraftModel> {
    const URL = this.baseUrl;

    return this.http.post<DraftModel>(URL, model, this.jwtService.getRequestOptions());
  }

  /**
   * 更新（差分更新）
   *
   * @param reply 更新するモデル(更新対象のプロパティのみ定義したモデル,ただし_idは指定必須)
   * @return 更新後のモデル
   */
  update(model: DraftModel): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    return this.http.put<DraftModel>(URL, model, this.jwtService.getRequestOptions());
  }

  /**
   * 削除（物理削除）
   *
   * @param _id 削除対象モデルの_id
   * @return 削除したモデル
   */
  delete(_id: string): Observable<DraftModel>  {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<DraftModel>(URL, this.jwtService.getRequestOptions());
  }


  /**
   * 指定したユーザが下書きを新規登録できるか
   *
   * @param _id ユーザモデルの_id
   * @return 新規登録できる場合はtrue できない場合はfalse
   */
  canRegisterDraft(_id: string): Observable<boolean> {
    return this.get({ author: _id })
            .map(drafts => drafts ? drafts.length : 0)
            // MAX_DRAFT_COUNTちょうどの場合はこれ以上下書きを保存できないのでfalseとみなす
            .map(count => count < this.Constant.MAX_DRAFT_COUNT);
  }
}
