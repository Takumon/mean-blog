import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DraftModel } from './draft.model';
import { DraftActions, DraftActionTypes } from './draft.actions';

export interface State extends EntityState<DraftModel> {
  loading: boolean;
}

export const adapter: EntityAdapter<DraftModel> = createEntityAdapter<DraftModel>({
  selectId: d => d._id,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(
  state = initialState,
  action: DraftActions
): State {
  switch (action.type) {
    case DraftActionTypes.AddDraft: {
      return adapter.addOne(action.payload.draft, state);
    }

    case DraftActionTypes.UpsertDraft: {
      return adapter.upsertOne(action.payload.draft, state);
    }

    case DraftActionTypes.AddDrafts: {
      return adapter.addMany(action.payload.drafts, state);
    }

    case DraftActionTypes.UpsertDrafts: {
      return adapter.upsertMany(action.payload.drafts, state);
    }

    case DraftActionTypes.UpdateDraft: {
      return adapter.updateOne(action.payload.draft, state);
    }

    case DraftActionTypes.UpdateDrafts: {
      return adapter.updateMany(action.payload.drafts, state);
    }

    case DraftActionTypes.DeleteDraft: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DraftActionTypes.DeleteDrafts: {
      return adapter.removeMany(action.payload.ids, state);
    }

    // 複数件取得
    case DraftActionTypes.LoadDrafts: {
      return Object.assign({}, {...state, loading: true} );
    }

    case DraftActionTypes.LoadDraftsSuccess: {
      return adapter.addAll(action.payload.drafts,  {...state, loading: false});
    }

    case DraftActionTypes.LoadDraftsFail: {
      return Object.assign({}, {...state, loading: false} );
    }

    // 一件削除
    case DraftActionTypes.DeleteDraft: {
      return Object.assign({}, {...state, loading: true} );
    }

    case DraftActionTypes.DeleteDraftSuccess: {
      return adapter.removeOne(action.payload.draft._id,  {...state, loading: false});
    }

    case DraftActionTypes.DeleteDraftFail: {
      return Object.assign({}, {...state, loading: false} );
    }


    case DraftActionTypes.ClearDrafts: {
      return adapter.removeAll(state);
    }

     // TODO アプリ全体のStoreに移行
    case DraftActionTypes.ShowSnackbar: {
      return state;
    }

    default: {
      return state;
    }
  }
}


export const getLoading = (state: State) => state.loading;
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
