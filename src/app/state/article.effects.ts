import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ArticleService } from '../shared/services';
import { Observable, of } from 'rxjs';
import { ArticleActionTypes, LoadArticles, LoadArticlesSuccess, LoadArticlesFail } from './article.actions';
import { switchMap, map, catchError } from 'rxjs/operators';


@Injectable()
export class ArticleEffects {

  constructor(
    private actions$: Actions,
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
}
