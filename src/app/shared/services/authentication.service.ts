import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserModel } from '../../users/shared/user.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JwtService } from './jwt.service';
import { LocalStrageService, KEY } from './local-strage.service';


/**
 * 認証操作を行い、ユーザ情報と認証トークンを保持する
 */
@Injectable()
export class AuthenticationService {
  loginUser: UserModel;
  isFinishedCheckState: boolean;

  private base_url = '/api/authenticate';

  constructor(
    public http: Http,
    private jwtService: JwtService,
    private localStrageService: LocalStrageService,
  ) {
    this.initLoginUser();
  }

  initLoginUser() {
    this.loginUser = null;
    this.isFinishedCheckState = false;
  }

  login(user: {
    userId: string,
    password: string,
  }): Observable<Object> {
    const URL = `${this.base_url}/login`;

    return this.http
      .post(URL, user)
      .map((res: Response) => this.setToken(res) )
      .catch((res: Response) => Observable.throw(res.json()));
  }


  register(user: {
    userId: string,
    password: string,
    confirmPassword: string,
  }): Observable<Object> {
    const URL = `${this.base_url}/register`;

    return this.http
      .post(URL, user)
      .map((res: Response) => this.setToken(res) )
      .catch((res: Response) => Observable.throw(res.json()));
  }

  changePassword(passwordInfo: {
    oldPassword: string,
    newPassword: string,
    newConfirmPassword: string
  }): Observable<Object> {

    const URL = `${this.base_url}/changePassword`;

    passwordInfo['_id'] = this.loginUser._id;

    return this.http
      .put(URL, passwordInfo)
      .map((res: Response) => this.setToken(res) )
      .catch((res: Response) => Observable.throw(res.json()));
  }

  isLogin(): Boolean {
    return !!this.localStrageService.get(KEY.TOKEN);
  }

  checkState(): Observable<any> {
    const URL = `${this.base_url}/check-state`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => this.setToken(res) )
      .catch((res: Response) => Observable.throw(res.json()));
  }


  // ログイン画面に戻る時に使用する
  logout() {
    this.initLoginUser();
    this.localStrageService.remove(KEY.TOKEN);
  }


  private setToken(res): Object {
    const body = res.json();
    if ( body.success !== true ) {
      return body;
    }

    this.localStrageService.set(KEY.TOKEN, body.token);
    this.loginUser = body.user;
    this.isFinishedCheckState = true;

    return body;
  }

  getToken(): String {
    return this.localStrageService.get(KEY.TOKEN);
  }

  hasToken(): boolean {
    return this.localStrageService.has(KEY.TOKEN);
  }
}
