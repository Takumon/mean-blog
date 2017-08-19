import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { UserModel } from '../../users/shared/user.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { JwtService } from './jwt.service';
import { CurrentUserService } from './current-user.service';


/**
 * 認証操作を行い、ユーザ情報と認証トークンを保持する
 */
@Injectable()
export class AuthenticationService {
  private base_url = '/api/authenticate';
  private userSource = new Subject<UserModel>();

  constructor(
    public http: Http,
    private jwtService: JwtService,
    private currentUserService: CurrentUserService,
  ) { }


  loginUser(user: UserModel): Observable<Object> {
    const URL = `${this.base_url}/login`;

    // TODO URL JSON形式でいいか検討
    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }


  registerUser(user: UserModel): Observable<Object> {
    const URL = `${this.base_url}/register`;

    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }

  verify(): Observable<Object> {
    const URL = `${this.base_url}/check-state`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map( res => res.json() );
  }


  logout() {
    this.currentUserService.remove();
  }


  private setToken(res): Object {
    const body = res.json();
    if ( body.success !== true ) {
      return body;
    }

    const currentUser = {
      _id: body._id,
      token: body.token
    };
    this.currentUserService.set(currentUser);

    return body;
  }
}
