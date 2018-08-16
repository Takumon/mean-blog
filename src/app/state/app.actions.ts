import { Action } from '@ngrx/store';



export enum AppActionTypes {
  ShowSnackbar = '[App] Show Snackbar',
}

export class ShowSnackbar implements Action {
  readonly type = AppActionTypes.ShowSnackbar;

  constructor(public payload: {
    message: string,
    action: string,
    config?: Object
  }) {}
}

export type AppActions = ShowSnackbar;
