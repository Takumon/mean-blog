import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { ArticleService } from '../shared/services';
import { Observable, of } from 'rxjs';
import {
  ArticleActionTypes,
  LoadArticles,
  LoadArticlesSuccess,
  LoadArticlesFail,
  AddArticle,
  AddArticleSuccess,
  AddArticleFail,
  UpdateArticle,
  UpdateArticleSuccess,
  DeleteArticle,
  DeleteArticleSuccess,
  LoadArticle,
  LoadArticleSuccess,
  DeleteVote,
  DeleteVoteSuccess,
  DeleteVoteFail,
  AddVote,
  AddVoteSuccess,
  AddVoteFail,
  AddVoteOfArticles,
  AddVoteOfArticlesSuccess,
  AddVoteOfArticlesFail,
  DeleteVoteOfArticles,
  DeleteVoteOfArticlesSuccess,
  DeleteVoteOfArticlesFail
} from './article.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { ShowSnackbar } from './app.actions';
import { Constant } from '../shared/constant';
import { ArticleModel, ArticleWithUserModel } from '../shared/models';
import * as fromArticle from '.';


@Injectable()
export class ArticleEffects {
  private Constant = Constant;

  constructor(
    private actions$: Actions,
    private articleService: ArticleService,
    private store$: Store<fromArticle.State>,
  ) {}

  // 複数件取得
  @Effect()
  loadArticles$: Observable<Action> = this.actions$.pipe(
    ofType<LoadArticles>(ArticleActionTypes.LoadArticles),
    switchMap(action =>
      this.articleService
        .get(
          action.payload.condition,
          action.payload.paginAndSortOptions,
          action.payload.withUser
        )
        .pipe(
          map(data => new LoadArticlesSuccess({
            count: data.count,
            articles: data.articles
          })),
          catchError(error => of(new LoadArticlesFail({ error })))
        )
    )
  );


  // 一件登録
  @Effect()
  addArticle$: Observable<Action> = this.actions$.pipe(
    ofType<AddArticle>(ArticleActionTypes.AddArticle),
    switchMap(action =>
      this.articleService
        .register(action.payload.article)
        .pipe(
          map(data => new AddArticleSuccess({
            article: data.obj
          })),
          catchError(error => of(new AddArticleFail({ error })))
        )
    )
  );

  @Effect()
  addArticleSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<AddArticleSuccess>(ArticleActionTypes.AddArticleSuccess),
    switchMap(action => of(new ShowSnackbar({
        message: `記事「${action.payload.article.title}」を保存しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );


  // 一件更新
  @Effect()
  updateArticle$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateArticle>(ArticleActionTypes.UpdateArticle),
    switchMap(action => {
      const target = {
        ...action.payload.article.changes,
        _id: action.payload.article.id.toString()
      } as ArticleModel;


      return this.articleService
        .update(target)
        .pipe(
          map(data => new UpdateArticleSuccess({ article: { id: data.obj._id, changes: data.obj }})),
          catchError(error => of(new AddArticleFail({ error })))
        );
    })
  );

  @Effect()
  updateArticleSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateArticleSuccess>(ArticleActionTypes.UpdateArticleSuccess),
    switchMap(action => of(new ShowSnackbar({
        message: `記事「${action.payload.article.changes.title}」を更新しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );


  // TODO 記事一覧用、分離を検討
   // いいね追加
  @Effect()
  addVoteOfArticles$: Observable<Action> = this.actions$.pipe(
    ofType<AddVoteOfArticles>(ArticleActionTypes.AddVoteOfArticles),
    switchMap(action =>
      this.articleService
        .registerVote(action.payload._idOfArticle, action.payload._idOfVoter)
        .pipe(
          map(data => new AddVoteOfArticlesSuccess({
            _idOfArticle: action.payload._idOfArticle,
            vote: data.obj
          })),
          catchError(error => of(new AddVoteOfArticlesFail({ error })))
        )
      )
  );

  @Effect()
  addVoteOfArticlesSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<AddVoteSuccess>(ArticleActionTypes.AddVoteSuccess),
    switchMap(action =>
      of(new ShowSnackbar({
        message: `いいねしました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );

  // いいね削除
  @Effect()
  delteVoteOfArticles$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteVoteOfArticles>(ArticleActionTypes.DeleteVoteOfArticles),
    switchMap(action =>
      this.articleService
        .deleteVote(action.payload._idOfArticle, action.payload._idOfVoter)
        .pipe(
          map(data => new DeleteVoteOfArticlesSuccess({
            _idOfArticle: action.payload._idOfArticle,
            vote: data.obj
          })),
          catchError(error => of(new DeleteVoteOfArticlesFail({ error })))
        )
    )
  );

  @Effect()
  delteVoteOfArticlesSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteVoteOfArticlesSuccess>(ArticleActionTypes.DeleteVoteOfArticlesSuccess),
    switchMap(action =>
      of(new ShowSnackbar({
        message: `いいねを削除しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );




  // TODO 記事詳細用、分離を検討
  // 一件取得
  @Effect()
  loadArticle$: Observable<Action> = this.actions$.pipe(
    ofType<LoadArticle>(ArticleActionTypes.LoadArticle),
    switchMap(action =>
      this.articleService.getById(action.payload.id, action.payload.withUser)
        .pipe(
          map(data => new LoadArticleSuccess({ article: data as ArticleWithUserModel })),
          catchError(error => of(new LoadArticlesFail({ error })))
        )
    )
  );


  // 一件削除
  @Effect()
  deleteArticle$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteArticle>(ArticleActionTypes.DeleteArticle),
    withLatestFrom(this.store$),
    switchMap(([action, storeState]) =>

      this.articleService
        .delete(storeState.article.article._id)
        .pipe(
          map(data => new DeleteArticleSuccess({ article: data.obj })),
          catchError(error => of(new AddArticleFail({ error })))
        )
    )
  );

  @Effect()
  deleteArticleSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteArticleSuccess>(ArticleActionTypes.DeleteArticleSuccess),
    switchMap(action => of(new ShowSnackbar({
        message: `記事「${action.payload.article.title}」を削除しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );


  // いいね追加
  @Effect()
  addVote$: Observable<Action> = this.actions$.pipe(
    ofType<AddVote>(ArticleActionTypes.AddVote),
    withLatestFrom(this.store$),
    switchMap(([action, storeState]) =>
      this.articleService
        .registerVote(storeState.article.article._id, action.payload._idOfVoter)
        .pipe(
          map(data => new AddVoteSuccess({ vote: data.obj })),
          catchError(error => of(new AddVoteFail({ error })))
        )
    )
  );

  @Effect()
  addVoteSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<AddVoteSuccess>(ArticleActionTypes.AddVoteSuccess),
    switchMap(action =>
      of(new ShowSnackbar({
        message: `いいねしました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );

  // いいね削除
  @Effect()
  delteVote$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteVote>(ArticleActionTypes.DeleteVote),
    withLatestFrom(this.store$),
    switchMap(([action, storeState]) =>
      this.articleService
        .deleteVote(storeState.article.article._id, action.payload._idOfVoter)
        .pipe(
          map(data => new DeleteVoteSuccess({ vote: data.obj })),
          catchError(error => of(new DeleteVoteFail({ error })))
        )
    )
  );

  @Effect()
  delteVoteSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteVoteSuccess>(ArticleActionTypes.DeleteVoteSuccess),
    switchMap(action =>
      of(new ShowSnackbar({
        message: `いいねを削除しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }))
    )
  );

}
