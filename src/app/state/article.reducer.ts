import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ArticleModel, ArticleWithUserModel } from '../shared/models';
import { ArticleActions, ArticleActionTypes } from './article.actions';

export interface State extends EntityState<ArticleModel | ArticleWithUserModel> {
  loading: boolean;
  count: number;
}

export const adapter: EntityAdapter<ArticleModel | ArticleWithUserModel> = createEntityAdapter<ArticleModel | ArticleWithUserModel>({
  selectId: d => d._id,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  count: 0
});

export function reducer(
  state = initialState,
  action: ArticleActions
): State {
  switch (action.type) {
    case ArticleActionTypes.UpsertArticle: {
      return adapter.upsertOne(action.payload.article, state);
    }

    case ArticleActionTypes.AddArticles: {
      return adapter.addMany(action.payload.articles, state);
    }

    case ArticleActionTypes.UpsertArticles: {
      return adapter.upsertMany(action.payload.articles, state);
    }


    case ArticleActionTypes.UpdateArticles: {
      return adapter.updateMany(action.payload.articles, state);
    }

    case ArticleActionTypes.DeleteArticle: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ArticleActionTypes.DeleteArticles: {
      return adapter.removeMany(action.payload.ids, state);
    }

    // 複数件取得
    case ArticleActionTypes.LoadArticles: {
      return Object.assign({}, {...state, loading: true} );
    }

    case ArticleActionTypes.LoadArticlesSuccess: {
      return adapter.addAll(action.payload.articles, {
        ...state,
        count: action.payload.count,
        loading: false
      } );
    }

    case ArticleActionTypes.LoadArticlesFail: {
      return Object.assign({}, {...state, loading: false} );
    }

    // 一件登録
    case ArticleActionTypes.AddArticle: {
      return Object.assign({}, {...state, loading: true} );
    }

    case ArticleActionTypes.AddArticleSuccess: {
      return adapter.addOne(action.payload.article, {
        ...state,
        loading: false
      });
    }

    case ArticleActionTypes.AddArticleFail: {
      return Object.assign({}, {...state, loading: false} );
    }

    // 一件更新
    case ArticleActionTypes.UpdateArticle: {
      return Object.assign({}, {...state, loading: true} );
    }

    case ArticleActionTypes.UpdateArticleSuccess: {
      return adapter.updateOne(action.payload.article, {
        ...state,
        loading: false
      });
    }

    case ArticleActionTypes.UpdateArticleFail: {
      return Object.assign({}, {...state, loading: false} );
    }



    case ArticleActionTypes.ClearArticles: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getCount = (state: State) => state.count;
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
