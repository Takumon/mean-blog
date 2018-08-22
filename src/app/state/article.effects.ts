import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ArticleService, AuthenticationService } from '../shared/services';
import { Observable, of } from 'rxjs';
import { ArticleActionTypes, LoadArticles, LoadArticlesSuccess, LoadArticlesFail, AddArticle, AddArticleSuccess, AddArticleFail } from './article.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ShowSnackbar } from './app.actions';
import { Constant } from '../shared/constant';
import { Router } from '@angular/router';


@Injectable()
export class ArticleEffects {
  private Constant = Constant;

  constructor(
    private router: Router,
    private actions$: Actions,
    private auth: AuthenticationService,
    private articleService: ArticleService,
  ) {}

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

  @Effect()
  addArticles$: Observable<Action> = this.actions$.pipe(
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
  AddArticleSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<AddArticleSuccess>(ArticleActionTypes.AddArticleSuccess),
    switchMap(action => {

      this.router.navigate([`${this.auth.loginUser.userId}`, 'articles', action.payload.article._id]);

      return of(new ShowSnackbar({
        message: `記事「${action.payload.article.title}」を保存しました。`,
        action: null,
        config: this.Constant.SNACK_BAR_DEFAULT_OPTION
      }));
    })
  );
}
