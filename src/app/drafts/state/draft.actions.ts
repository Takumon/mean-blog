import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { DraftModel } from './draft.model';

export enum DraftActionTypes {
  LoadDrafts = '[Draft] Load Drafts',
  AddDraft = '[Draft] Add Draft',
  UpsertDraft = '[Draft] Upsert Draft',
  AddDrafts = '[Draft] Add Drafts',
  UpsertDrafts = '[Draft] Upsert Drafts',
  UpdateDraft = '[Draft] Update Draft',
  UpdateDrafts = '[Draft] Update Drafts',
  DeleteDraft = '[Draft] Delete Draft',
  DeleteDrafts = '[Draft] Delete Drafts',
  ClearDrafts = '[Draft] Clear Drafts',

  LoadDraftsSuccess = '[Draft] Load Drafts Success',
  AddDraftSuccess = '[Draft] Add Draft Success',
  UpsertDraftSuccess = '[Draft] Upsert Draft Success',
  AddDraftsSuccess = '[Draft] Add Drafts Success',
  UpsertDraftsSuccess = '[Draft] Upsert Drafts Success',
  UpdateDraftSuccess = '[Draft] Update Draft Success',
  UpdateDraftsSuccess = '[Draft] Update Drafts Success',
  DeleteDraftSuccess = '[Draft] Delete Draft Success',
  DeleteDraftsSuccess = '[Draft] Delete Drafts Success',
  ClearDraftsSuccess = '[Draft] Clear Drafts Success',

  LoadDraftsFail = '[Draft] Load Drafts Fail',
  AddDraftFail = '[Draft] Add Draft Fail',
  UpsertDraftFail = '[Draft] Upsert Draft Fail',
  AddDraftsFail = '[Draft] Add Drafts Fail',
  UpsertDraftsFail = '[Draft] Upsert Drafts Fail',
  UpdateDraftFail = '[Draft] Update Draft Fail',
  UpdateDraftsFail = '[Draft] Update Drafts Fail',
  DeleteDraftFail = '[Draft] Delete Draft Fail',
  DeleteDraftsFail = '[Draft] Delete Drafts Fail',
  ClearDraftsFail = '[Draft] Clear Drafts Fail',
}


export class LoadDrafts implements Action {
  readonly type = DraftActionTypes.LoadDrafts;

  constructor(public payload: { condition: {userId: string} }) {}
}


export class LoadDraftsSuccess implements Action {
  readonly type = DraftActionTypes.LoadDraftsSuccess;

  constructor(public payload: { drafts: DraftModel[] }) {}
}


export class LoadDraftsFail implements Action {
  readonly type = DraftActionTypes.LoadDraftsFail;

  constructor(public payload?: { error: any }) {}
}

export class AddDraft implements Action {
  readonly type = DraftActionTypes.AddDraft;

  constructor(public payload: { draft: DraftModel }) {}
}

export class UpsertDraft implements Action {
  readonly type = DraftActionTypes.UpsertDraft;

  constructor(public payload: { draft: DraftModel }) {}
}

export class AddDrafts implements Action {
  readonly type = DraftActionTypes.AddDrafts;

  constructor(public payload: { drafts: DraftModel[] }) {}
}

export class UpsertDrafts implements Action {
  readonly type = DraftActionTypes.UpsertDrafts;

  constructor(public payload: { drafts: DraftModel[] }) {}
}

export class UpdateDraft implements Action {
  readonly type = DraftActionTypes.UpdateDraft;

  constructor(public payload: { draft: Update<DraftModel> }) {}
}

export class UpdateDrafts implements Action {
  readonly type = DraftActionTypes.UpdateDrafts;

  constructor(public payload: { drafts: Update<DraftModel>[] }) {}
}

export class DeleteDraft implements Action {
  readonly type = DraftActionTypes.DeleteDraft;

  constructor(public payload: { id: string }) {}
}

export class DeleteDraftSuccess implements Action {
  readonly type = DraftActionTypes.DeleteDraftSuccess;

  constructor(public payload: { draft: DraftModel }) {}
}

export class DeleteDraftFail implements Action {
  readonly type = DraftActionTypes.DeleteDraftFail;

  constructor(public payload?: { error: any }) {}
}

export class DeleteDrafts implements Action {
  readonly type = DraftActionTypes.DeleteDrafts;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearDrafts implements Action {
  readonly type = DraftActionTypes.ClearDrafts;
}

export type DraftActions =
  // 複数件取得
  LoadDrafts
 | LoadDraftsSuccess
 | LoadDraftsFail
 | AddDraft
 | UpsertDraft
 | AddDrafts
 | UpsertDrafts
 | UpdateDraft
 | UpdateDrafts
 // 一件削除
 | DeleteDraft
 | DeleteDraftSuccess
 | DeleteDraftFail
 | DeleteDrafts
 | ClearDrafts;
