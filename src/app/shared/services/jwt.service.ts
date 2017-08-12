import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { CurrentUserService } from './current-user.service';

/**
 * 認証が必要なサーバリクエストのリクエストヘッダーを生成する
 */
@Injectable()
export class JwtService {

  constructor(
    private currentUserService: CurrentUserService
  ) {}

  getHeaders() {
    if (!this.currentUserService.hasToken()) {
      return;
    }

    return new Headers({
      'x-access-token': this.currentUserService.getToken()
    });
  }

  getRequestOptions() {
    if (!this.currentUserService.hasToken()) {
      return;
    }

    return new RequestOptions({ headers: this.getHeaders() });
  }
}
