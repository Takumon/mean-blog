import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { User } from '../../users/shared/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { JwtService } from './jwt.service';
import { CurrentUserService } from './current-user.service';


/**
 * 認証操作を行い、ユーザ情報と認証トークンを保持する
 */
@Injectable()
export class AuthenticationService {
  // TODO tokenを保持する場所がここが最適なのか？
  token: string;
  private base_url = '/api/authenticate';
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  constructor(
    public http: Http,
    private jwtService: JwtService,
    private currentUserService: CurrentUserService,
  ) { }

  setUser(user: User) {
    this.userSource.next(user);
  }



  loginUser(user: User): Observable<Object> {
    const URL = `${this.base_url}/login`;

    // TODO URL JSON形式でいいか検討
    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }


  registerUser(user: User): Observable<Object> {
    const URL = `${this.base_url}/register`;

    return this.http
      .post(URL, user)
      .map( res => this.setToken(res) );
  }

  verify(): Observable<Object> {
    const URL = `${this.base_url}/check-state`;

    return this.http
      .get(URL, this.jwtService.jwt())
      .map( res => res.json() );
  }


  logout() {
    this.token = null;
    this.currentUserService.remove();
  }


  private setToken(res): Object {
    const body = res.json();
    if ( body.success !== true ) {
      return body;
    }

    this.token = body.token;

    const currentUser = {
      userId: body.user.userId,
      token: body.token
    };
    this.currentUserService.set(currentUser);

    return body;
  }
}
