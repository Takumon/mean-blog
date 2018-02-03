import { Injectable } from '@angular/core';


export enum LOCALSTORAGE_KEY {
  TOKEN,
  SELECTED_CONDITION_ID,
}


/**
 * ローカルストレージ管理サービス
 */
@Injectable()
export class LocalStorageService {

  get(key: LOCALSTORAGE_KEY): string {
    return localStorage.getItem(key.toString());
  }

  set(key: LOCALSTORAGE_KEY, value: string) {
    localStorage.setItem(key.toString(), value);
  }

  remove(key: LOCALSTORAGE_KEY): void {
    localStorage.removeItem(key.toString());
  }

  has(key: LOCALSTORAGE_KEY): boolean {
    return !!this.get(key);
  }
}
