import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent, MatPaginatorIntl } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ScrollService } from '../../shared/services/scroll.service';
import { PaginatorService } from '../../shared/services/paginator.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { LocalStorageService, LOCALSTORAGE_KEY } from '../../shared/services/local-storage.service';
import { UserService } from '../../users/shared/user.service';
import { UserModel } from '../../users/shared/user.model';
import { ArticleService, Condition } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { SearchConditionComponent } from '../search-condition/search-condition.component';
import { Constant } from '../../shared/constant';

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
  private searchCondition: Condition;

  /** 検索結果 */
  public articles: Array<ArticleWithUserModel>;
  /** 検索結果件数 */
  public count: number;

  private onDestroy = new Subject();
  private mode;

  constructor(
    private scrollService: ScrollService,
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public paginatorService: MatPaginatorIntl,
    public auth: AuthenticationService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.route.data
    .takeUntil(this.onDestroy)
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
    this.onDestroy.next();
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
      this.getArticles(this.searchCondition, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        count: this.count
      });
    });
  }

  onChangeSearchCondition(searchCondition: Condition) {

    this.initPaging();
    this.initSort();

    this.showPrograssBar = true;

    this.searchCondition = searchCondition;
    this.getArticles(this.searchCondition, {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      count: this.count
    });
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
      this.getArticles(this.searchCondition, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        count: this.count
      });
      return;
    }

　  this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getArticles(this.searchCondition, {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      count: this.count
    });
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

    this.getArticles(this.searchCondition, {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      count: this.count
    });
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
  private constructSearchCondition(cb: (searchCondition: Condition) => void ): void {
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
        .takeUntil(this.onDestroy)
        .subscribe( params => cb({author: { userId: params['_userId'] }}));
        break;

      case ArticleSearchMode.VOTER:
        this.route.parent.params
        .takeUntil(this.onDestroy)
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
  private getArticles(searchCondition: Condition, pageingOption: {
    pageIndex: number,
    pageSize: number,
    count: number
  }): void {
    const selectedSortFactor = this.getSelectedSortFactor();
    const range = (this.paginatorService as PaginatorService).calcRange(pageingOption.pageIndex, pageingOption.pageSize, pageingOption.count);

    const pageingAndSortOption = {
      sort: {
        [selectedSortFactor.value]: selectedSortFactor.direction === SortDirection.ASC ? 1 : -1
      },
      skip: range.startIndex,
      limit: range.endIndex - range.startIndex
    };

    // withUserをtrueに設定しているので戻り値の型を絞ってかえす
    this.articleService.get(searchCondition, pageingAndSortOption , true)
    .subscribe(({count, articles}) => {

      this.count = count;
      this.articles = articles as ArticleWithUserModel[];
      this.showPrograssBar = false;

      // 画面条文にスクロールする
      setTimeout(function() {
        this.scrollService.scrollToTop();

      }.bind(this), 0);
    });
  }
}
