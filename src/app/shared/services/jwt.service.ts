import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { JwtTokenService } from './jwt-token.service';

/**
 * 認証が必要なサーバリクエストのリクエストヘッダーを生成する
 */
@Injectable()
export class JwtService {

  constructor(
    private jwtTokenService: JwtTokenService
  ) {}

  getHeaders() {
    if (!this.jwtTokenService.has()) {
      return;
    }

    return new Headers({
      'x-access-token': this.jwtTokenService.get()
    });
  }

  getRequestOptions() {
    if (!this.jwtTokenService.has()) {
      return;
    }

    return new RequestOptions({ headers: this.getHeaders() });
  }
}
