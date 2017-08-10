import { Injectable } from '@angular/core';

const LOCAL_STRAGE_KEY_USER = 'currentUser';

/**
 * 認証情報をローカルストレージで管理する
 */
@Injectable()
export class CurrentUserService {

  get() {
    return JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY_USER));
  }

  set(currentUer: Object) {
    localStorage.setItem(LOCAL_STRAGE_KEY_USER, JSON.stringify(currentUer));
  }

  remove() {
    localStorage.removeItem(LOCAL_STRAGE_KEY_USER);
  }

  hasToken(): Boolean {
    return !!this.getToken();
  }

  getToken() {
    const user = this.get();
    return user && user.token;
  }
}
