import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UserModel } from './user.model';
import { JwtService } from '../../shared/services/jwt.service';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { CurrentUserModel } from '../../shared/models/current-user.model';


@Injectable()
export class UserService {
  baseUrl = '/api/users';

  constructor(
    private http: Http,
    private jwtService: JwtService,
    private currentUserService: CurrentUserService,
  ) { }

  getAll(): Observable<Array<UserModel>> {
    const URL = this.baseUrl;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json() as Array<UserModel>);
  }

  getById(_id: string): Observable<UserModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json() as UserModel);
  }

  create(user: UserModel) {
    const URL = this.baseUrl;

    return this.http
      .post(URL, user, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  update(user: UserModel) {
    const URL = `${this.baseUrl}/${user._id}`;

    return this.http
      .put(URL, user, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  delete(userId: number) {
    const URL = `${this.baseUrl}/${userId}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  getLoginUser(): Observable<UserModel> {
    const currentUser: CurrentUserModel = this.currentUserService.get();
    if (!currentUser) {
      return;
    }
    return this.getById(currentUser._id);
  }

}
