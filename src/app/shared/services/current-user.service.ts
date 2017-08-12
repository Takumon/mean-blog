import { Injectable } from '@angular/core';

import { CurrentUserModel } from '../models/current-user.model';

const LOCAL_STRAGE_KEY_USER = 'currentUser';

/**
 * 認証情報をローカルストレージで管理する
 */
@Injectable()
export class CurrentUserService {

  get(): CurrentUserModel {
    return JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY_USER));
  }

  set(currentUer: CurrentUserModel) {
    localStorage.setItem(LOCAL_STRAGE_KEY_USER, JSON.stringify(currentUer));
  }

  remove() {
    localStorage.removeItem(LOCAL_STRAGE_KEY_USER);
  }

  hasToken(): Boolean {
    return !!this.getToken();
  }

  getToken(): string {
    const user = this.get();
    return user && user.token;
  }
}
