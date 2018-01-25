import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { JwtService } from '../../shared/services/jwt.service';

import { SearchConditionModel } from './search-condition.model';


// 登録(Create)、更新(Update)、削除時(delete)のレスポンス
interface CudResponse {
  message: string;
  obj: SearchConditionModel;
}

// 検索条件を複数件取得する際の検索条件
interface Condition {
  userId?: string | string[];
}

/**
 * 検索条件のサービスクラス
 */
@Injectable()
export class SearchConditionService {
  /** 定数：日付検索のパターン */
  private dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  /** 本サービスのベースURL */
  private baseUrl = '/api/searchconditions';

  /** コンストラクタ */
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) { }

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param withUser 取得情報にユーザ情報を付与するか
   * @return 指定した検索条件に一致するモデルのリスト
   */
  get(condition: Condition, withUser = false): Observable<Array<SearchConditionModel>> {
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    let params = new HttpParams().set('condition', JSON.stringify(condition));
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    const options = { headers, params };

    return this.http.get<Array<SearchConditionModel>>(URL, options);
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

    const headers = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    const options = { headers, params };

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

    return this.http.post<CudResponse>(URL, searchCondition, this.jwtService.getRequestOptions());
  }

  /**
   * 更新（差分更新）
   *
　 * @param searchCondition 更新するモデル(更新対象のプロパティのみ定義したモデル)
   * @return 更新後のモデル
   */
  update(searchCondition: SearchConditionModel): Observable<{message: string, obj: SearchConditionModel}> {
    const URL = `${this.baseUrl}/${searchCondition._id}`;

    return this.http.put<{message: string, obj: SearchConditionModel}>(URL, searchCondition, this.jwtService.getRequestOptions());
  }

  /**
   * 削除（物理削除）
   *
   * @param _id 削除対象モデルの_id
   * @return 削除したモデル
   */
  delete(_id: string): Observable<{message: string, obj: SearchConditionModel}> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<{message: string, obj: SearchConditionModel}>(URL, this.jwtService.getRequestOptions());
  }
}
