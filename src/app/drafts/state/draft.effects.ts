import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { DraftActionTypes, LoadDrafts, LoadDraftsSuccess, LoadDraftsFail, DeleteDraft, DeleteDraftSuccess, DeleteDraftFail, ShowSnackbar,  } from './draft.actions';
import { DraftService } from '../shared';
import { Constant } from '../../shared/constant';


@Injectable()
export class DraftEffects {
  private Constant = Constant;

  constructor(
    private actions$: Actions,
    private draftsService: DraftService,
    public snackbar: MatSnackBar,
  ) {}


  /**
   * Load drafts
   */
  @Effect()
  loadTodos$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDrafts>(DraftActionTypes.LoadDrafts),
    switchMap(action =>
      this.draftsService
        .get(action.payload.condition)
        .pipe(
          map(data => new LoadDraftsSuccess({ drafts: data })),
          catchError(error => of(new LoadDraftsFail({ error })))
        )
    )
  );

  /**
   * delete draft
   */
  @Effect()
  deleteTodo$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteDraft>(DraftActionTypes.DeleteDraft),
    switchMap(action =>
      this.draftsService
        .delete(action.payload.id)
        .pipe(
          map(data => new DeleteDraftSuccess({ draft: data })),
          catchError(error => of(new DeleteDraftFail({ error })))
        )
    )
  );

  /**
   * delete draft success
   */
  @Effect()
  deleteTodoSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteDraftSuccess>(DraftActionTypes.DeleteDraftSuccess),
    switchMap(action => of(new ShowSnackbar({
      message: `下書き「${action.payload.draft.title}」を削除しました。`,
      action: null,
      config: this.Constant.SNACK_BAR_DEFAULT_OPTION
    })))
  );

  // TODO アプリ全体のStoreに移行
  @Effect()
  shwoSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<ShowSnackbar>(DraftActionTypes.ShowSnackbar),
    switchMap(a => {

      const {
        message,
        action,
        config
      } = a.payload;

      this.snackbar.open(message, action, config);
      return of({type: 'NO_ACTION'});
    })
  );


}
