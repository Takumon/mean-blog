import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromArticle from './article.reducer';

export interface State {

  article: fromArticle.State;
}

export const reducers: ActionReducerMap<State> = {

  article: fromArticle.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
