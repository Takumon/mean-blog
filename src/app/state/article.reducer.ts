import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Article } from './article.model';
import { ArticleActions, ArticleActionTypes } from './article.actions';

export interface State extends EntityState<Article> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Article> = createEntityAdapter<Article>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: ArticleActions
): State {
  switch (action.type) {
    case ArticleActionTypes.AddArticle: {
      return adapter.addOne(action.payload.article, state);
    }

    case ArticleActionTypes.UpsertArticle: {
      return adapter.upsertOne(action.payload.article, state);
    }

    case ArticleActionTypes.AddArticles: {
      return adapter.addMany(action.payload.articles, state);
    }

    case ArticleActionTypes.UpsertArticles: {
      return adapter.upsertMany(action.payload.articles, state);
    }

    case ArticleActionTypes.UpdateArticle: {
      return adapter.updateOne(action.payload.article, state);
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

    case ArticleActionTypes.LoadArticles: {
      return adapter.addAll(action.payload.articles, state);
    }

    case ArticleActionTypes.ClearArticles: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
