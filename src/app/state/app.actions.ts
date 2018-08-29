import { Action } from '@ngrx/store';



export enum AppActionTypes {
  ShowSnackbar = '[App] Show Snackbar',
  SetTitle = '[App Set Title]',
  ClearTitle = '[App Clear Title]'
}

export class ShowSnackbar implements Action {
  readonly type = AppActionTypes.ShowSnackbar;

  constructor(public payload: {
    message: string,
    action: string,
    config?: Object
  }) {}
}

export class SetTitle implements Action {
  readonly type = AppActionTypes.SetTitle;

  constructor(public payload: {
    title: string
  }) {}
}

export class ClearTitle implements Action {
  readonly type = AppActionTypes.ClearTitle;

  constructor() {}
}


export type AppActions =
  ShowSnackbar
  | SetTitle
  | ClearTitle;
