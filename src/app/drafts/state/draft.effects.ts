import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { DraftActionTypes, LoadDrafts, LoadDraftsSuccess, LoadDraftsFail, DeleteDraft, DeleteDraftSuccess, DeleteDraftFail,  } from './draft.actions';
import { DraftService } from '../shared';


@Injectable()
export class DraftEffects {

  constructor(
    private actions$: Actions,
    private draftsService: DraftService,
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

}
