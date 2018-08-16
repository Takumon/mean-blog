import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, catchError, share } from 'rxjs/operators';

import {
  DraftActionTypes,
  LoadDrafts,
  LoadDraftsSuccess,
  LoadDraftsFail,
  DeleteDraft,
  DeleteDraftSuccess,
  DeleteDraftFail,
  AddDraft,
  AddDraftSuccess,
  AddDraftFail,
  UpdateDraft,
  UpdateDraftSuccess,
  UpdateDraftFail,
} from './draft.actions';

import { DraftService } from '../shared';
import { Constant } from '../../shared/constant';
import { DraftModel } from './draft.model';
import { ShowSnackbar } from '../../state/app.actions';


@Injectable()
export class DraftEffects {
  private Constant = Constant;

  constructor(
    private router: Router,
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
   * Add drafts
   */
  @Effect()
  addTodo$: Observable<Action> = this.actions$.pipe(
    ofType<AddDraft>(DraftActionTypes.AddDraft),
    switchMap(action =>
      this.draftsService
        .register(action.payload.draft)
        .pipe(
          map(data => new AddDraftSuccess({ draft: data })),
          catchError(error => of(new AddDraftFail({ error })))
        )
    )
  );

  /**
   * Add draft success
   */
  @Effect()
  addDraftSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<AddDraftSuccess>(DraftActionTypes.AddDraftSuccess),
    switchMap(action => {
      this.router.navigate(['drafts', action.payload.draft._id]);

      return of(new ShowSnackbar({
        message: `下書き「${action.payload.draft.title}」を保存しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }));
    })
  );

  /**
   * update draft
   */
  @Effect()
  updateDraft$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateDraft>(DraftActionTypes.UpdateDraft),
    switchMap(action => {
      const target = {
        ...action.payload.draft.changes,
        _id: action.payload.draft.id.toString()
      } as DraftModel;

      return this.draftsService
        .update(target)
        .pipe(
          map(data => new UpdateDraftSuccess({ draft: { id: data._id, changes: data }})),
          catchError(error => of(new UpdateDraftFail({ error })))
        );
    })
  );

  /**
   * update draft success
   */
  @Effect()
  updateDraftSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateDraftSuccess>(DraftActionTypes.UpdateDraftSuccess),
    switchMap(action => {
      this.router.navigate(['drafts', action.payload.draft.id]);

      return of(new ShowSnackbar({
        message: `下書き「${action.payload.draft.changes.title}」を更新しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }));
    })
  );


  /**
   * delete draft
   */
  @Effect()
  deleteDraft$: Observable<Action> = this.actions$.pipe(
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
  deleteDraftSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteDraftSuccess>(DraftActionTypes.DeleteDraftSuccess),
    switchMap(action => of(new ShowSnackbar({
      message: `下書き「${action.payload.draft.title}」を削除しました。`,
      action: null,
      config: this.Constant.SNACK_BAR_DEFAULT_OPTION
    })))
  );

}
