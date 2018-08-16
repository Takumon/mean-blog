import { AppActions, AppActionTypes } from './app.actions';




export interface State {
  hoge: string;
}

export const initialState: State = {
  hoge: ''
};

export function reducer(
  state = initialState,
  action: AppActions
): State {
  switch (action.type) {
    case AppActionTypes.ShowSnackbar: {
      return state;
    }

    default: {
      return state;
    }
  }
}

