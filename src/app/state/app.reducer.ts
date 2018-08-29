import { AppActions, AppActionTypes } from './app.actions';




export interface State {
  title: string;
}

export const initialState: State = {
  title: ''
};

export function reducer(
  state = initialState,
  action: AppActions
): State {
  switch (action.type) {
    case AppActionTypes.ShowSnackbar: {
      return state;
    }

    case AppActionTypes.SetTitle: {
      return Object.assign({}, {...state, title: action.payload.title});
    }

    case AppActionTypes.ClearTitle: {
      return Object.assign({}, {...state, title: ''});
    }

    default: {
      return state;
    }
  }

}

export const getTitle = (state: State) => state.title;
