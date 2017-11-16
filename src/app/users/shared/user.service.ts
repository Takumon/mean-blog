import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UserModel } from './user.model';
import { JwtService } from '../../shared/services/jwt.service';


// TODO userIdと_idどちらかに統一
@Injectable()
export class UserService {
  private baseUrl = '/api/users';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) { }

  getAll(): Observable<Array<UserModel>> {
    const URL = this.baseUrl;

    return this.http.get<Array<UserModel>>(URL, this.jwtService.getRequestOptions());
  }

  getById(userId: string): Observable<UserModel> {
    const URL = `${this.baseUrl}/${userId}`;

    return this.http.get<UserModel>(URL, this.jwtService.getRequestOptions());
  }

  create(user: UserModel): Observable<UserModel> {
    const URL = this.baseUrl;

    return this.http.post<UserModel>(URL, user, this.jwtService.getRequestOptions());
  }

  // 更新処理（画像ファイルも含むのでenctypeはマルチパート）
  update(user: UserModel, avator, profileBackground): Observable<Object> {
    const URL = `${this.baseUrl}/${user._id}`;

    const headers: HttpHeaders = this.jwtService.getHeaders();
    const body = new FormData();
    body.append('blogTitle', user.blogTitle);
    body.append('email', user.email);
    body.append('userName', user.userName);
    body.append('userDescription', user.userDescription);
    body.append('avator', avator);
    body.append('profileBackground', profileBackground);


    return this.http.request('put', URL, { body, headers });
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete(URL, this.jwtService.getRequestOptions());
  }
}
