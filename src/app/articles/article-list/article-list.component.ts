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
import { LocalStrageService, KEY } from '../../shared/services/local-strage.service';
import { UserService } from '../../users/shared/user.service';
import { UserModel } from '../../users/shared/user.model';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { SearchConditionComponent } from '../search-condition/search-condition.component';

export enum Mode {
  ALL = 100,
  FAVORITE = 200,
  USER = 300,
  VOTER = 400,
}

enum Direction {
  ASC, DESC, NONE
}

interface SortFactor {
  label: string;
  value: string;
  sortFunc: Function;
  direction: Direction;
}

const SortFactors = {
  CREATE_DATE: {
    label: '登録日',
    value: 'created',
    direction: Direction.NONE,
  },
  UPDATE_DATE: {
    label: '更新日',
    value: 'updated',
    direction: Direction.NONE
  },
};


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  // TODO 定数化
  public DEFAULT_PER_PAGE = 20;
  public DEFAILT_PER_PAGES = [20, 50, 100];
  // TODO 型指定
  public favoriteSeaerchConditions: any;
  public articlesPerPage: Subject<Array<ArticleWithUserModel>> = new Subject<Array<ArticleWithUserModel>>();
  public showPrograssBar: Boolean = false;
  public direction = Direction;
  public sortFactors = SortFactors;
  public sortFactorKeys = Object.keys(SortFactors);

  // ページング用プロパティ
  public pageSize = this.DEFAULT_PER_PAGE;
  public pageIndex = 0;

   /** 検索条件（ページング用に保持しておく） */
  private searchCondition: any;

  /** 検索結果 */
  public articles: Array<ArticleWithUserModel>;
  /** 検索結果件数 */
  public count: number;

  private onDestroy = new Subject();
  @ViewChild(SearchConditionComponent)
  private searchConditionComponent: SearchConditionComponent;
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
      this.mode = data['mode'];
      switch (this.mode) {
        case Mode.ALL:
        case Mode.USER:
        case Mode.VOTER:
          this.getArticles();
          break;
        case Mode.FAVORITE:
          if (!this.auth.isLogin()) {
            this.getArticles();
          } else {
            // 子コンポーネントの検索条件初期化が終わったらgetArticlesを呼ぶ
            this.showPrograssBar = true;
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  trackByArticleId(index: number, item: ArticleWithUserModel): string {
    return item._id;
  }

  /**
   * 記事一覧を取得する
   */
  getArticles(): void {
    this.initPagingAndSort();

    this.constructSearchCondition(searchCondition => {
      this.searchCondition = searchCondition;
      this.refreshArticlesPerPage();
    });
  }

  /**
   * ソート条件とページング条件を初期化する
   */
  initPagingAndSort() {
    this.pageSize = this.DEFAULT_PER_PAGE;
    this.pageIndex = 0;
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];
      factor.direction = factor === SortFactors.CREATE_DATE
        ? Direction.DESC
        : Direction.NONE;
    }
  }

  /**
   * URLやmodeに応じた検索条件を組み立てる
   *
   * @param cb 検索条件組み立て後に呼ぶコールバック関数
   */
  constructSearchCondition(cb) {
    this.showPrograssBar = true;
    const withUser = true;
    switch (this.mode) {
      case Mode.ALL:
        cb({});
        break;
      case Mode.FAVORITE:
        // 検索条件がない時Mode.ALLと同じ
        if (!this.searchConditionComponent) {
          cb({});
          break;
        }

        this.favoriteSeaerchConditions = this.searchConditionComponent.createCondition();
        cb(this.favoriteSeaerchConditions);
        break;
      case Mode.USER:
        this.route.parent.params
        .takeUntil(this.onDestroy)
        .subscribe( params => {
          const userId = params['_userId'];
          cb({author: { userId: userId }});
        });
        break;
      case Mode.VOTER:
        this.route.parent.params
        .takeUntil(this.onDestroy)
        .subscribe( params => {
          const userId = params['_userId'];
          this.userService
          .getById(userId)
          .subscribe(user => {
            cb({ voter: user._id.toString()});
          });
        });
        break;
    }
  }

  isFavoriteMode(): boolean {
    return this.mode && this.mode === Mode.FAVORITE;
  }

  refreshPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshArticlesPerPage();
  }

  sortAndRefresh(selectedKey): void {
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];

      if (selectedKey === key) {
        switch (factor.direction) {
          case Direction.NONE:
          case Direction.ASC:
            factor.direction = Direction.DESC;
            break;
          case Direction.DESC:
            factor.direction = Direction.ASC;
        }
      } else {
        if (factor.direction !== Direction.NONE) {
          factor.direction = Direction.NONE;
        }
      }
    }

    this.refreshArticlesPerPage();
  }

  // ページングとソートの設定に従って表示する記事をセットする
  refreshArticlesPerPage() {
    let selectedSortFactor: SortFactor;
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];
      if (factor.direction !== Direction.NONE) {
        selectedSortFactor = factor;
        break;
      }
    }


    const pageingOptions = {};
    pageingOptions['sort'] = {};
    pageingOptions['sort'][selectedSortFactor.value] = selectedSortFactor.direction === Direction.ASC ? 1 : -1;

    const range = (this.paginatorService as PaginatorService).calcRange(this.pageIndex, this.pageSize, this.count);
    pageingOptions['skip'] = range.startIndex;
    pageingOptions['limit'] = range.endIndex - range.startIndex;


    const withUser = true;
    this.articleService
    .get(this.searchCondition, pageingOptions , withUser)
    .subscribe(({count, articles}) => {
      this.count = count;
      this.articles = articles as Array<ArticleWithUserModel>;
      this.showPrograssBar = false;

      setTimeout(function() {
        this.scrollService.scrollToTop();
      }.bind(this), 0);
    });

  }
}
