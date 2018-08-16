import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { ShowSnackbar, AppActionTypes } from './app.actions';


@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    public snackbar: MatSnackBar,
  ) {}

  // TODO アプリ全体のStoreに移行
  @Effect({dispatch: false})
  shwoSnackbar = this.actions$.pipe(
    ofType<ShowSnackbar>(AppActionTypes.ShowSnackbar),
    tap(a => {

      const {
        message,
        action,
        config
      } = a.payload;

      this.snackbar.open(message, action, config);
    })
  );

}
