import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UserModel } from './user.model';
import { JwtService } from '../../shared/services/jwt.service';


// TODO userIdと_idどちらかに統一
@Injectable()
export class UserService {
  private baseUrl = '/api/users';

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) { }

  getAll(): Observable<Array<UserModel>> {
    const URL = this.baseUrl;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json() as Array<UserModel>)
      .catch((res: Response) => Observable.throw(res.json()));
    }

  getById(userId: string): Observable<UserModel> {
    const URL = `${this.baseUrl}/${userId}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json() as UserModel)
      .catch((res: Response) => Observable.throw(res.json()));
  }

  create(user: UserModel) {
    const URL = this.baseUrl;

    return this.http
      .post(URL, user, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  update(user: UserModel): Observable<Object> {
    const URL = `${this.baseUrl}/${user._id}`;

    return this.http
      .put(URL, user, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((res: Response) => Observable.throw(res.json()));
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((res: Response) => Observable.throw(res.json()));
  }
}
