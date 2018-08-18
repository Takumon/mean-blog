import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromApp from './app.reducer';
import * as fromArticle from './article.reducer';


export interface State {
  app: fromApp.State;
  article: fromArticle.State;
}

export const reducers: ActionReducerMap<State> = {
  app: fromApp.reducer,
  article: fromArticle.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

