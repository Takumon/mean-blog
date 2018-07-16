import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * 画面遷移時に画面タイトルを子コンポーネントからルートコンポーネントへ知らせるためのサービス
 */
@Injectable()
export class RouteNamesService {
  public name = new Subject<String>();
}
