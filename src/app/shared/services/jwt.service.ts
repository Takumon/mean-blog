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

  jwt() {
    if (!this.currentUserService.hasToken()) {
      return;
    }

    const headers = new Headers({
      'x-access-token': this.currentUserService.getToken()
    });
    return new RequestOptions({ headers: headers });
  }
}
