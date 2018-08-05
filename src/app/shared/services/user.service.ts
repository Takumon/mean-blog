import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  UserModel,
  CudSuccessModel,
} from '../models';



/**
 * 検索条件を複数件取得する際の検索条件
 */
export interface Condition {
  limit?: number;
  offset?: number;
}

@Injectable()
export class UserService {
  private baseUrl = '/api/users';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * 複数件検索
   *
   * @param condition 検索条件
   * @return 指定した検索条件に一致するモデルのリスト
   */
  get(condition: Condition = {limit: 100, offset: 0}): Observable<UserModel[]> {
    const URL = this.baseUrl;

    const params = new HttpParams().set('condition', JSON.stringify(condition));
    const option = { params };

    return this.http.get<Array<UserModel>>(URL, option);
  }

  /**
   * 一件検索
   *
   * @param userId 取得するモデルのuserId <b>_idではなくuserIdであることに注意</b>
   * @return 指定したuserIdに一致するモデル
   */
  getById(userId: string): Observable<UserModel> {
    const URL = `${this.baseUrl}/${userId}`;

    return this.http.get<UserModel>(URL);
  }

  /**
   * 登録
   *
   * @param model 登録するモデル
   * @return メッセージと登録後のモデル
   */
  create(user: UserModel): Observable<CudSuccessModel<UserModel>> {
    const URL = this.baseUrl;

    return this.http.post<CudSuccessModel<UserModel>>(URL, user);
  }

  /**
   * 更新（差分更新）<br>
   * 画像ファイルも含むのでenctypeはマルチパート
   *
   * @param user 更新するモデル（更新対象のみ指定したモデル）
   * @param avator ユーザのアバター画像
   * @param profileBackground ユーザの背景画像
   * @return メッセージと登録後のモデル
   */
  update(user: UserModel, avator, profileBackground): Observable<CudSuccessModel<UserModel>> {
    const URL = `${this.baseUrl}/${user._id}`;

    const body = new FormData();
    body.append('blogTitle', user.blogTitle);
    body.append('email', user.email);
    body.append('userName', user.userName);
    body.append('userDescription', user.userDescription);
    body.append('avator', avator);
    body.append('profileBackground', profileBackground);


    return this.http.request<CudSuccessModel<UserModel>>('put', URL, { body });
  }

  /**
   * 削除（論理削除）
   *
   * @param userId 削除するモデルの_id <b>userIdではなく_idであることに注意</b>
   * @return メッセージと登録後のモデル
   */
  delete(_id: string): Observable<CudSuccessModel<UserModel>> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<CudSuccessModel<UserModel>>(URL);
  }
}
