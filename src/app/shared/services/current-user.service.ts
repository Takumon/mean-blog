import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CurrentUserModel } from '../models/current-user.model';
import { UserModel } from '../../users/shared/user.model';


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

  remove(): void {
    localStorage.removeItem(LOCAL_STRAGE_KEY_USER);
  }

  hasToken(): Boolean {
    return !!this.getToken();
  }

  getToken(): string {
    const currentUser = this.get();
    return currentUser && currentUser.token;
  }
}
