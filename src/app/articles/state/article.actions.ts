import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Article } from './article.model';

export enum ArticleActionTypes {
  LoadArticles = '[Article] Load Articles',
  AddArticle = '[Article] Add Article',
  UpsertArticle = '[Article] Upsert Article',
  AddArticles = '[Article] Add Articles',
  UpsertArticles = '[Article] Upsert Articles',
  UpdateArticle = '[Article] Update Article',
  UpdateArticles = '[Article] Update Articles',
  DeleteArticle = '[Article] Delete Article',
  DeleteArticles = '[Article] Delete Articles',
  ClearArticles = '[Article] Clear Articles'
}

export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LoadArticles;

  constructor(public payload: { articles: Article[] }) {}
}

export class AddArticle implements Action {
  readonly type = ArticleActionTypes.AddArticle;

  constructor(public payload: { article: Article }) {}
}

export class UpsertArticle implements Action {
  readonly type = ArticleActionTypes.UpsertArticle;

  constructor(public payload: { article: Article }) {}
}

export class AddArticles implements Action {
  readonly type = ArticleActionTypes.AddArticles;

  constructor(public payload: { articles: Article[] }) {}
}

export class UpsertArticles implements Action {
  readonly type = ArticleActionTypes.UpsertArticles;

  constructor(public payload: { articles: Article[] }) {}
}

export class UpdateArticle implements Action {
  readonly type = ArticleActionTypes.UpdateArticle;

  constructor(public payload: { article: Update<Article> }) {}
}

export class UpdateArticles implements Action {
  readonly type = ArticleActionTypes.UpdateArticles;

  constructor(public payload: { articles: Update<Article>[] }) {}
}

export class DeleteArticle implements Action {
  readonly type = ArticleActionTypes.DeleteArticle;

  constructor(public payload: { id: string }) {}
}

export class DeleteArticles implements Action {
  readonly type = ArticleActionTypes.DeleteArticles;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearArticles implements Action {
  readonly type = ArticleActionTypes.ClearArticles;
}

export type ArticleActions =
 LoadArticles
 | AddArticle
 | UpsertArticle
 | AddArticles
 | UpsertArticles
 | UpdateArticle
 | UpdateArticles
 | DeleteArticle
 | DeleteArticles
 | ClearArticles;
