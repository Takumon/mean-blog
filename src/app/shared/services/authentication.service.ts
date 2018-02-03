import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserModel } from '../../users/shared/user.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JwtService } from './jwt.service';
import { LocalStorageService, LOCALSTORAGE_KEY } from './local-storage.service';


/**
 * 認証操作を行い、ユーザ情報と認証トークンを保持する
 */
@Injectable()
export class AuthenticationService {
  loginUser: UserModel;
  isFinishedCheckState = false;

  private base_url = '/api/authenticate';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private localStorageService: LocalStorageService,
  ) {
  }


  login(user: {
    userId: string,
    password: string,
  }): Observable<Object> {
    const URL = `${this.base_url}/login`;

    return this.http
      .post<Object>(URL, user)
      .map((res: Response) => this.setToken(res) );
  }


  register(user: {
    userId: string,
    password: string,
    confirmPassword: string,
  }): Observable<Object> {
    const URL = `${this.base_url}/register`;

    return this.http
      .post<Object>(URL, user)
      .map((res: Response) => this.setToken(res) );
  }

  changePassword(passwordInfo: {
    oldPassword: string,
    newPassword: string,
    newConfirmPassword: string
  }): Observable<Object> {

    const URL = `${this.base_url}/changePassword`;

    passwordInfo['_id'] = this.loginUser._id;

    return this.http
      .put<Object>(URL, passwordInfo)
      .map((res: Response) => this.setToken(res) );
  }

  checkState(): Observable<any> {
    const URL = `${this.base_url}/check-state`;

    return this.http
      .get<any>(URL, this.jwtService.getRequestOptions())
      .map(res => this.setToken(res))
      .catch(res => {
        this.isFinishedCheckState = true;
        return Observable.throw(res);
      });
  }


  // ログイン画面に戻る時に使用する
  logout() {
    this.loginUser = null;
    this.localStorageService.remove(LOCALSTORAGE_KEY.TOKEN);
  }


  private setToken(res): Object {
    if ( res.success !== true ) {
      return res;
    }

    this.localStorageService.set(LOCALSTORAGE_KEY.TOKEN, res.token);
    this.loginUser = res.user;
    this.isFinishedCheckState = true;

    return res;
  }

  isLogin(): boolean {
    return !!this.loginUser;
  }

  isAdmin(): boolean {
    return this.isLogin() && this.loginUser.isAdmin;
  }

  getToken(): String {
    return this.localStorageService.get(LOCALSTORAGE_KEY.TOKEN);
  }

  hasToken(): boolean {
    return this.localStorageService.has(LOCALSTORAGE_KEY.TOKEN);
  }
}
