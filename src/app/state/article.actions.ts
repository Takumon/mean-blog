import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ArticleModel } from '../shared/models/article.model';
import { SearchArticlesCondition, PageAndSortOption } from '../shared/services';
import { ArticleWithUserModel } from '../shared/models';

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
  ClearArticles = '[Article] Clear Articles',


  LoadArticlesSuccess = '[Article] Load Articles Success',
  AddArticleSuccess = '[Article] Add Article Success',
  UpsertArticleSuccess = '[Article] Upsert Article Success',
  AddArticlesSuccess = '[Article] Add Articles Success',
  UpsertArticlesSuccess = '[Article] Upsert Articles Success',
  UpdateArticleSuccess = '[Article] Update Article Success',
  UpdateArticlesSuccess = '[Article] Update Articles Success',
  DeleteArticleSuccess = '[Article] Delete Article Success',
  DeleteArticlesSuccess = '[Article] Delete Articles Success',
  ClearArticlesSuccess = '[Article] Clear Articles Success',


  LoadArticlesFail = '[Article] Load Articles Fail',
  AddArticleFail = '[Article] Add Article Fail',
  UpsertArticleFail = '[Article] Upsert Article Fail',
  AddArticlesFail = '[Article] Add Articles Fail',
  UpsertArticlesFail = '[Article] Upsert Articles Fail',
  UpdateArticleFail = '[Article] Update Article Fail',
  UpdateArticlesFail = '[Article] Update Articles Fail',
  DeleteArticleFail = '[Article] Delete Article Fail',
  DeleteArticlesFail = '[Article] Delete Articles Fail',
  ClearArticlesFail = '[Article] Clear Articles Fail',

}

export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LoadArticles;

  constructor(public payload: {
    condition: SearchArticlesCondition,
    paginAndSortOptions: PageAndSortOption,
    withUser?: boolean
  }) {}
}


export class LoadArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticlesSuccess;

  constructor(public payload: {
    count: number,
    articles: ArticleModel[] | ArticleWithUserModel[]
  }) {}
}


export class LoadArticlesFail implements Action {
  readonly type = ArticleActionTypes.LoadArticlesFail;

  constructor(public payload?: { error: any }) {}
}

export class AddArticle implements Action {
  readonly type = ArticleActionTypes.AddArticle;

  constructor(public payload: { article: ArticleModel }) {}
}

export class AddArticleSuccess implements Action {
  readonly type = ArticleActionTypes.AddArticleSuccess;

  constructor(public payload: { article: ArticleModel }) {}
}

export class AddArticleFail implements Action {
  readonly type = ArticleActionTypes.AddArticleFail;

  constructor(public payload: { error: any }) {}
}

export class UpsertArticle implements Action {
  readonly type = ArticleActionTypes.UpsertArticle;

  constructor(public payload: { article: ArticleModel | ArticleWithUserModel }) {}
}

export class AddArticles implements Action {
  readonly type = ArticleActionTypes.AddArticles;

  constructor(public payload: { articles: ArticleModel[] | ArticleWithUserModel[] }) {}
}

export class UpsertArticles implements Action {
  readonly type = ArticleActionTypes.UpsertArticles;

  constructor(public payload: { articles: ArticleModel[] | ArticleWithUserModel[] }) {}
}

export class UpdateArticle implements Action {
  readonly type = ArticleActionTypes.UpdateArticle;

  constructor(public payload: { article: Update<ArticleModel> }) {}
}

export class UpdateArticleSuccess implements Action {
  readonly type = ArticleActionTypes.UpdateArticleSuccess;

  constructor(public payload: { article: Update<ArticleModel> }) {}
}

export class UpdateArticleFail implements Action {
  readonly type = ArticleActionTypes.UpdateArticleFail;

  constructor(public payload: { error: any }) {}
}


export class UpdateArticles implements Action {
  readonly type = ArticleActionTypes.UpdateArticles;

  constructor(public payload: { articles: Update<ArticleModel | ArticleWithUserModel>[] }) {}
}

export class DeleteArticle implements Action {
  readonly type = ArticleActionTypes.DeleteArticle;

  constructor(public payload: { id: string }) {}
}


export class DeleteArticleSuccess implements Action {
  readonly type = ArticleActionTypes.DeleteArticleSuccess;

  constructor(public payload: { article: ArticleModel }) {}
}

export class DeleteArticleFail implements Action {
  readonly type = ArticleActionTypes.DeleteArticleFail;

  constructor(public payload: { error: any }) {}
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
 | LoadArticlesSuccess
 | LoadArticlesFail
 | AddArticle
 | AddArticleSuccess
 | AddArticleFail
 | UpsertArticle
 | AddArticles
 | UpsertArticles
 | UpdateArticle
 | UpdateArticleSuccess
 | UpdateArticleFail
 | UpdateArticles
 | DeleteArticle
 | DeleteArticleSuccess
 | DeleteArticleFail
 | DeleteArticles
 | ClearArticles;
