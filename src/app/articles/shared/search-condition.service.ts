import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SearchConditionModel } from './search-condition.model';


/**
 * 登録(Create)、更新(Update)、削除時(delete)のレスポンス
 */
interface CudResponse {
  message: string;
  obj: SearchConditionModel;
}

/**
 * 検索条件を複数件取得するときの検索条件
 */
interface Condition {
  userId?: string | string[];
}

/**
 * 検索条件のサービスクラス
 */
@Injectable()
export class SearchConditionService {

  /** 本サービスのベースURL */
  private baseUrl = '/api/searchconditions';

  /** コンストラクタ */
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した検索条件に一致するモデルのリスト
   */
  get(condition: Condition, withUser = false): Observable<SearchConditionModel[]> {
    const URL = this.baseUrl;

    let params = new HttpParams().set('condition', JSON.stringify(condition));
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    const options = { params };

    return this.http.get<SearchConditionModel[]>(URL, options);
  }

  /**
   * 一件取得
   *
   * @param _id 取得対象モデルの_id
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した_idに一致するモデル情報
   */
  getById(_id: string, withUser = false): Observable<SearchConditionModel> {
    const URL = `${this.baseUrl}/${_id}`;

    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    const options = { params };

    return this.http.get<SearchConditionModel>(URL, options);
  }

  /**
   * 登録
   *
   * @param searchCondition 登録するモデル
   * @return 登録後のモデル
   */
  register(searchCondition: SearchConditionModel): Observable<CudResponse> {
    const URL = this.baseUrl;

    return this.http.post<CudResponse>(URL, searchCondition);
  }

  /**
   * 更新（差分更新）
   *
　 * @param searchCondition 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @return 更新後のモデル
   */
  update(searchCondition: SearchConditionModel): Observable<CudResponse> {
    const URL = `${this.baseUrl}/${searchCondition._id}`;

    return this.http.put<CudResponse>(URL, searchCondition);
  }

  /**
   * 削除（物理削除）
   *
   * @param _id 削除対象モデルの_id
   * @return 削除したモデル
   */
  delete(_id: string): Observable<CudResponse> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<CudResponse>(URL);
  }
}
