import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { UserModel } from './user.model';
import { JwtService } from '../../shared/services/jwt.service';

@Injectable()
export class UserService {
   baseUrl = '/api/users';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) { }

  getAll() {
    const URL = this.baseUrl;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  getById(userId: number) {
    const URL = `${this.baseUrl}/${userId}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  create(user: UserModel) {
    const URL = this.baseUrl;

    return this.http
      .post(URL, user, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  update(user: UserModel) {
    const URL = `${this.baseUrl}/${user.userId}`;

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
}
