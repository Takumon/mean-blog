import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/Rx';

import { MessageBarComponent } from '../components/message-bar.component';

@Injectable()
export class MessageBarService {
  private snackBarRef: any;

  constructor(public snackBar: MatSnackBar) {
  }

  // 入力チェックエラーメッセージをスナックバーで表示する
  showValidationError(error: any): Observable<any> {
    console.log(error);
    if (error.errors && error.errors.length > 0) {
      this.openSnackBar(
        error.errors.map(e => e.msg),
        { duration: 20000,
          extraClasses: ['snackbar__validation']}
      );
    }

    return Observable.of(error);
  }

  openSnackBar(messages: Array<String> = [], configs: MatSnackBarConfig = { duration: 100000 }) {

    configs.data = {
      messages: messages.map(m => {
        return {'message' : m };
      })
    };
    this.snackBarRef = this.snackBar.openFromComponent(MessageBarComponent, configs);
    this.snackBarRef.instance.instanceForSnackBar = this.snackBarRef;
  }
}
