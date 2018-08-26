import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ArticleModel } from '../shared/models/article.model';
import { SearchArticlesCondition, PageAndSortOption } from '../shared/services';
import { ArticleWithUserModel, UserModel } from '../shared/models';

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


  // TODO EntityStateと分離するか検討
  LoadArticle = '[Article] Load Article',
  LoadArticleSuccess = '[Article] Load Article Success',
  LoadArticleFail = '[Article] Load Article Fail',
  AddVote = '[Article Vote] Add Vote',
  AddVoteSuccess = '[Article Vote] Add Vote Success',
  AddVoteFail = '[Article Vote] Add Vote Fail',
  DeleteVote = '[Article Vote] Delete Vote',
  DeleteVoteSuccess = '[Article Vote] Delete Vote Success',
  DeleteVoteFail = '[Article Vote] Delete Vote Fail',

}


export class LoadArticleSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticleSuccess;

  constructor(public payload: {
    article: ArticleWithUserModel
  }) {}
}

export class LoadArticleFail implements Action {
  readonly type = ArticleActionTypes.LoadArticleFail;

  constructor(public payload?: { error: any }) {}
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




export class DeleteArticles implements Action {
  readonly type = ArticleActionTypes.DeleteArticles;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearArticles implements Action {
  readonly type = ArticleActionTypes.ClearArticles;
}




export class LoadArticle implements Action {
  readonly type = ArticleActionTypes.LoadArticle;

  constructor(public payload: {
    id: string,
    withUser: boolean
  }) {}
}

// Storeのarticleから指定したいいねをい削除する
// 記事削除
export class DeleteArticle implements Action {
  readonly type = ArticleActionTypes.DeleteArticle;

  constructor() {}
}


export class DeleteArticleSuccess implements Action {
  readonly type = ArticleActionTypes.DeleteArticleSuccess;

  constructor(public payload: { article: ArticleModel }) {}
}

export class DeleteArticleFail implements Action {
  readonly type = ArticleActionTypes.DeleteArticleFail;

  constructor(public payload: { error: any }) {}
}


// いいね追加
export class AddVote implements Action {
  readonly type = ArticleActionTypes.AddVote;

  constructor(public payload: {
    _idOfVoter: string
  }) {}
}


export class AddVoteSuccess implements Action {
  readonly type = ArticleActionTypes.AddVoteSuccess;

  constructor(public payload: {
    vote: UserModel[]
  }) {}
}

export class AddVoteFail implements Action {
  readonly type = ArticleActionTypes.AddVoteFail;

  constructor(public payload: {error: any}) {}
}


// いいね削除
export class DeleteVote implements Action {
  readonly type = ArticleActionTypes.DeleteVote;

  constructor(public payload: {
    _idOfVoter: string
  }) {}
}


export class DeleteVoteSuccess implements Action {
  readonly type = ArticleActionTypes.DeleteVoteSuccess;

  constructor(public payload: {
    vote: UserModel[]
  }) {}
}

export class DeleteVoteFail implements Action {
  readonly type = ArticleActionTypes.DeleteVoteFail;

  constructor(public payload: {error: any}) {}
}




export type ArticleActions =
 LoadArticleSuccess
 | LoadArticleFail
 | LoadArticles
 | LoadArticlesSuccess
 | LoadArticlesFail
 | UpsertArticle
 | AddArticles
 | UpsertArticles
 | UpdateArticle
 | UpdateArticleSuccess
 | UpdateArticleFail
 | UpdateArticles
 | DeleteArticles
 | ClearArticles

 | LoadArticle

 | AddArticle
 | AddArticleSuccess
 | AddArticleFail

 | DeleteArticle
 | DeleteArticleSuccess
 | DeleteArticleFail

 | AddVote
 | AddVoteSuccess
 | AddVoteFail

 | DeleteVote
 | DeleteVoteSuccess
 | DeleteVoteFail

 ;
