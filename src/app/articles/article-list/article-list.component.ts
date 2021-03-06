import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent, MatPaginatorIntl } from '@angular/material';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';

import * as fromArticle from '../../state';
import { Constant } from '../../shared/constant';
import {
  PaginatorService,
  AuthenticationService,
  UserService,
  SearchArticlesCondition,
} from '../../shared/services';
import { ArticleWithUserModel } from '../../shared/models';

import { ScrollService } from '../shared/scroll.service';
import {
  LoadArticles,
  ArticleActionTypes,
  LoadArticlesSuccess
} from '../../state/article.actions';

export enum ArticleSearchMode {
  ALL = 100,
  FAVORITE = 200,
  USER = 300,
  VOTER = 400,
}

enum SortDirection {
  ASC, DESC, NONE
}

interface SortFactor {
  label: string;
  value: string;
  direction: SortDirection;
}

const SortFactors: {[key: string]: SortFactor} = {
  CREATE_DATE: {
    label: '登録日',
    value: 'created',
    direction: SortDirection.NONE,
  },
  UPDATE_DATE: {
    label: '更新日',
    value: 'updated',
    direction: SortDirection.NONE
  },
};


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;


  /**
   * プログレスバーを表示するか
   */
  public showPrograssBar = false;
  public direction = SortDirection;
  public sortFactors = SortFactors;
  public sortFactorKeys = Object.keys(SortFactors);

  // ページング用プロパティ
  public pageSize = Constant.DEFAULT_PER_PAGE;
  public pageIndex = 0;


  /** 検索条件（ソート、ページング用に保持しておく） */
  private searchCondition: SearchArticlesCondition;

  private destroyed$ = new Subject();
  private mode;

  public articles$: Observable<ArticleWithUserModel[]>;
  public count$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private actions$: Actions,
    private store: Store<fromArticle.State>,
    public paginatorService: MatPaginatorIntl,
    public auth: AuthenticationService,
    private userService: UserService,
    private scrollService: ScrollService
  ) {
    this.loading$ = this.store.select(fromArticle.getLoading);
    this.articles$ = this.store.select(fromArticle.getArticles).pipe(
      map(articles => articles as ArticleWithUserModel[])
    );
    this.count$ = this.store.select(fromArticle.getCount);

    this.actions$.pipe(
      takeUntil(this.destroyed$),
      ofType<LoadArticlesSuccess>(ArticleActionTypes.LoadArticlesSuccess),
      tap(action => {
        this.showPrograssBar = false;

        // 画面条文にスクロールする
        setTimeout(function() {
          this.scrollService.scrollToTop();
        }.bind(this), 0);
      })
    ).subscribe();



  }

  ngOnInit() {
    this.route.data
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data: any) => {
      // モードを保持
      this.mode = data['mode'];

      // ログイン時かつお気に入り検索時は
      // 検索条件初期化が終わったら、そのイベントを検知して
      // getArticlesを呼ぶためここでは呼び出さない
      if (this.mode === ArticleSearchMode.FAVORITE && this.auth.isLogin()) {
        // プログレスバーを表示しておく
        this.showPrograssBar = true;
      } else {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * 記事検索時に検索条件がないか<br>
   * 検索結果が0件時の文言出し分けのために使用する
   **/
  public hasNoSearchCondition() {
    return this.searchCondition && Object.keys(this.searchCondition).length === 0;
  }

  /**
   * コンポーネント初期化時の処理
   */
  init(): void {
    this.initPaging();
    this.initSort();

    this.showPrograssBar = true;

    this.constructSearchCondition(searchCondition => {
      this.searchCondition = searchCondition;
      this.getArticles(this.searchCondition);
    });
  }

  onChangeSearchCondition(searchCondition: SearchArticlesCondition) {

    this.initPaging();
    this.initSort();

    this.showPrograssBar = true;

    this.searchCondition = searchCondition;
    this.getArticles(this.searchCondition);
  }

  /**
   * modeがお気に入り検索か判定する
   *
   * @return modeがお気に入り検索の場合true. それ以外の場合false
   */
  isFavoriteMode(): boolean {
    return this.mode && this.mode === ArticleSearchMode.FAVORITE;
  }

  /**
   * ページング時に記事一覧を再検索する.
   *
   * @param event ページングイベント
   */
  refreshPage(event: PageEvent): void {
    // ページサイズを変更する時は現在のページが存在しない可能性があるので1ページに初期化
    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.pageIndex = 0;
      this.getArticles(this.searchCondition);
      return;
    }

　  this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getArticles(this.searchCondition);
  }

  /**
   * ソート時に記事一覧を再建策する.
   *
   * @param selectedKey
   */
  sortAndRefresh(selectedKey): void {
    // ソート時は最初のページに戻る
    this.initPaging();

    // ソート条件設定
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];

      // 指定したソートキー以外はdirectionを初期化
      if (selectedKey !== key) {
        factor.direction = SortDirection.NONE;
        continue;
      }

      // 指定したソートキーのdirectionをトグルする
      // 特にdirectionが未指定の場合はDESCにする
      switch (factor.direction) {
        case SortDirection.NONE:
        case SortDirection.ASC:
          factor.direction = SortDirection.DESC;
          break;
        case SortDirection.DESC:
          factor.direction = SortDirection.ASC;
          break;
      }
    }

    this.getArticles(this.searchCondition);
  }

  /**
   * ページ数初期化
   */
  private initPaging(): void {
    this.pageIndex = 0;
  }

  /**
   * ソート条件初期化
   */
  private initSort(): void {
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];
      // 作成日を降順にしてその他のdirectionを解除する
      factor.direction = factor === SortFactors.CREATE_DATE
        ? SortDirection.DESC
        : SortDirection.NONE;
    }
  }

  /**
   * URLやmodeに応じた検索条件を組み立てる.
   * <p>
   * MODEがFAVORITの場合はonChangeSearchConditionで検索条件を設定するので本メソッドは実行されない
   * </p>
   *
   * @param cb 検索条件を引数に渡すコールバック関数
   */
  private constructSearchCondition(cb: (searchCondition: SearchArticlesCondition) => void ): void {
    switch (this.mode) {
      case ArticleSearchMode.ALL:
        cb({});
        break;

      // 見ログイン時は全件検索と同様
      case ArticleSearchMode.FAVORITE:
        if (!this.auth.isLogin()) {
          cb({});
        }
        break;

      case ArticleSearchMode.USER:
        this.route.parent.params
        .pipe(takeUntil(this.destroyed$))
        .subscribe( params => cb({author: { userId: params['_userId'] }}));
        break;

      case ArticleSearchMode.VOTER:
        this.route.parent.params
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe( params => {
          this.userService
          .getById(params['_userId'])
          .subscribe(user => cb({ voter: user._id.toString()}));
        });
        break;
    }
  }

  /**
   * 指定したソート項目を取得する
   *
   * @return 指定したソート項目
   */
  private getSelectedSortFactor(): SortFactor {
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];
      if (factor.direction !== SortDirection.NONE) {
        return factor;
      }
    }

    // 必ずソート項目は指定しているので
    // ここに到達した場合は例外をスローする
    throw new Error('ソート項目が選択されていない情報');
  }

  /**
   * 保持している検索条件と、ページングとソートの設定に従って記事一覧を取得する
   *
   * @param searchCondition 記事検索条件
   */
  private getArticles(searchCondition: SearchArticlesCondition): void {
    const selectedSortFactor = this.getSelectedSortFactor();

    this.getPagingRang().subscribe(range => {

      const pageingAndSortOption = {
        sort: {
          [selectedSortFactor.value]: selectedSortFactor.direction === SortDirection.ASC ? 1 : -1
        },
        skip: range.startIndex,
        limit: range.endIndex - range.startIndex
      };

      // withUserをtrueに設定しているので戻り値の型を絞ってかえす
      this.store.dispatch(new LoadArticles({
        condition: searchCondition,
        paginAndSortOptions: pageingAndSortOption,
        withUser: true
      }));

    });
  }

  /**
   * 記事検索時に必要なページング情報を取得する.
   */
  private getPagingRang(): Observable<{ startIndex: number; endIndex: number; }> {
    return this.count$.pipe(
      map(count => (this.paginatorService as PaginatorService).calcRange(this.pageIndex, this.pageSize, count))
    );
  }
}
