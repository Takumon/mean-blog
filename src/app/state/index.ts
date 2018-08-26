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


/**
 * Selectors
 */
export const getAppState = (state: State) => state.app;
export const getTitle = createSelector(getAppState, fromApp.getTitle);

export const getArticleEntitiyState = (state: State) => state.article;
export const getArticles = createSelector(getArticleEntitiyState, fromArticle.selectAll);
export const getLoading = createSelector(getArticleEntitiyState, fromArticle.getLoading);
export const getArticle = createSelector(getArticleEntitiyState, fromArticle.getArticle);
export const getCount = createSelector(getArticleEntitiyState, fromArticle.getCount);
