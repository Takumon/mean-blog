import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromDraft from './draft.reducer';

export interface State {
  drafts: fromDraft.State;
}

export const reducers: ActionReducerMap<State> = {

  drafts: fromDraft.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

/**
 * Selectors
 */
export const getDraftFeatureState = createFeatureSelector<State>('draft');  // draft.module.tsの登録名
export const getDraftEntityState = createSelector(getDraftFeatureState, state => state.drafts);
export const getDrafts = createSelector(getDraftEntityState, fromDraft.selectAll);
export const getLoading = createSelector(getDraftEntityState, fromDraft.getLoading);
