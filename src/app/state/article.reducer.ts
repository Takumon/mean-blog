import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ArticleModel, ArticleWithUserModel } from '../shared/models';
import { ArticleActions, ArticleActionTypes } from './article.actions';

export interface State extends EntityState<ArticleModel | ArticleWithUserModel> {
  article: ArticleWithUserModel;
  loading: boolean;
  loadingArticle: boolean;
  loadingVote: boolean;
  count: number;
}

export const adapter: EntityAdapter<ArticleModel | ArticleWithUserModel> = createEntityAdapter<ArticleModel | ArticleWithUserModel>({
  selectId: d => d._id,
});

export const initialState: State = adapter.getInitialState({
  article: null,
  loading: false,
  loadingArticle: false,
  loadingVote: false,
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


    // 一件削除
    case ArticleActionTypes.DeleteArticle: {
      return Object.assign({}, {...state, loading: true });
    }

    case ArticleActionTypes.DeleteArticleSuccess: {
      return adapter.removeOne(action.payload.article._id, {
        ...state,
        loading: false
      });
    }

    case ArticleActionTypes.DeleteArticleFail: {
      return Object.assign({}, {
        ...state,
        loading: false,
      });
    }

    case ArticleActionTypes.ClearArticles: {
      return adapter.removeAll(state);
    }



    // TODO　記事一覧用。分離を検討
    // いいね追加
    case ArticleActionTypes.AddVoteOfArticles: {
      return Object.assign({}, {...state });
    }

    case ArticleActionTypes.AddVoteOfArticlesSuccess: {
      return adapter.updateOne({
        id: action.payload._idOfArticle,
        changes: {
          vote: action.payload.vote
        }
      }, {
        ...state,
      });
    }


    // いいね削除
    case ArticleActionTypes.DeleteVoteOfArticles: {
      return Object.assign({}, {...state });
    }

    case ArticleActionTypes.DeleteVoteOfArticlesSuccess: {
      return adapter.updateOne({
        id: action.payload._idOfArticle,
        changes: {
          vote: action.payload.vote
        }
      }, {
        ...state,
      });
    }




    // TODO 記事詳細用。分離を検討
    // 記事取得
    case ArticleActionTypes.LoadArticle: {
      return Object.assign({}, {...state, loadingArticle: true, article: null} );
    }
    case ArticleActionTypes.LoadArticleSuccess: {

      return Object.assign({}, {
        ...state,
        article: action.payload.article,
        loadingArticle: false,
      });
    }

    case ArticleActionTypes.LoadArticleFail: {
      return Object.assign({}, {...state, loadingArticle: false} );
    }

    // 記事削除
    case ArticleActionTypes.DeleteArticle: {
      return Object.assign({}, {...state, loading: true});
    }

    case ArticleActionTypes.DeleteArticleSuccess: {

      return Object.assign({}, {
        ...state,
        article: null,
        loadingArticle: false,
      });
    }

    case ArticleActionTypes.DeleteArticleFail: {
      return Object.assign({}, {...state, loadingArticle: false});
    }


    // いいね追加
    case ArticleActionTypes.AddVote: {
      return Object.assign({}, {...state, loadingVote: true});
    }

    case ArticleActionTypes.AddVoteSuccess: {
      return Object.assign({}, {
        ...state,
        article: {
          ...state.article,
          vote: action.payload.vote
        },
        loadingVote: false,
      });
    }

    case ArticleActionTypes.AddVoteFail: {
      return Object.assign({}, {...state, loadingVote: false} );
    }


    // いいね削除
    case ArticleActionTypes.DeleteVote: {
      return Object.assign({}, {...state, loadingVote: true});
    }

    case ArticleActionTypes.DeleteVoteSuccess: {
      return Object.assign({}, {
        ...state,
        article: {
          ...state.article,
          vote: action.payload.vote
        },
        loadingVote: false,
      });
    }

    case ArticleActionTypes.DeleteVoteFail: {
      return Object.assign({}, {...state, loadingVote: false} );
    }





    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getArticle = (state: State) => state.article;
export const getCount = (state: State) => state.count;
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
