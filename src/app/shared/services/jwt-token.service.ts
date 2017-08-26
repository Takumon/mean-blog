import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserModel } from '../../users/shared/user.model';


const LOCAL_STRAGE_KEY_TOKE = 'token';

/**
 * 認証情報をローカルストレージで管理する
 */
@Injectable()
export class JwtTokenService {

  get(): string {
    return localStorage.getItem(LOCAL_STRAGE_KEY_TOKE);
  }

  set(token: string) {
    localStorage.setItem(LOCAL_STRAGE_KEY_TOKE, token);
  }

  remove(): void {
    localStorage.removeItem(LOCAL_STRAGE_KEY_TOKE);
  }

  has(): boolean {
    return !!this.get();
  }
}
