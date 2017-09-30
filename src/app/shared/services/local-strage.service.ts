import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserModel } from '../../users/shared/user.model';


enum KEY {
  TOKEN,
  SELECTED_CONDITION_ID,
}

export { KEY };

/**
 * ローカルストレージ管理サービス
 */
@Injectable()
export class LocalStrageService {

  get(key: KEY): string {
    return localStorage.getItem(key.toString());
  }

  set(key: KEY, value: string) {
    localStorage.setItem(key.toString(), value);
  }

  remove(key: KEY): void {
    localStorage.removeItem(key.toString());
  }

  has(key: KEY): boolean {
    return !!this.get(key);
  }
}
