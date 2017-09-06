import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { UserModel } from '../../users/shared/user.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { JwtService } from './jwt.service';
import { JwtTokenService } from './jwt-token.service';


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
    private jwtTokenService: JwtTokenService,
  ) {
    this.initLoginUser();
  }

  initLoginUser() {
    this.loginUser = null;
    this.isFinishedCheckState = false;
  }

  login(user: UserModel): Observable<Object> {
    const URL = `${this.base_url}/login`;

    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }


  register(user: UserModel): Observable<Object> {
    const URL = `${this.base_url}/register`;

    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }

  isLogin(): Boolean {
    return !!this.jwtTokenService.get();
  }

  checkState(): Observable<any> {
    const URL = `${this.base_url}/check-state`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map( res => this.setToken(res));
  }


  // ログイン画面に戻る時に使用する
  logout() {
    this.initLoginUser();
    this.jwtTokenService.remove();
  }


  private setToken(res): Object {
    const body = res.json();
    if ( body.success !== true ) {
      return body;
    }

    this.jwtTokenService.set(body.token);
    this.loginUser = body.user;
    this.isFinishedCheckState = true;

    return body;
  }

  getToken(): String {
    return this.jwtTokenService.get();
  }

  hasToken(): boolean {
    return this.jwtTokenService.has();
  }
}
