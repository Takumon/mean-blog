import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders,  } from '@angular/common/http';

import { LocalStrageService, KEY } from './local-strage.service';

/**
 * 認証が必要なサーバリクエストのリクエストヘッダーを生成する
 */
@Injectable()
export class JwtService {

  constructor(
    private localStrageService: LocalStrageService
  ) {}

  getHeaders(): HttpHeaders {
    if (!this.localStrageService.has(KEY.TOKEN)) {
      return;
    }

    return new HttpHeaders({
      'x-access-token': this.localStrageService.get(KEY.TOKEN)
    });
  }

  getRequestOptions(): {headers: HttpHeaders} {
    if (!this.localStrageService.has(KEY.TOKEN)) {
      return;
    }

    return { headers: this.getHeaders() };
  }
}
