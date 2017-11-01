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

const SortFactors = {
  UPDATE_DATE: {
    label: '更新日',
    value: 'updated',
    sortFunc: function(isAsc: boolean): (a: ArticleWithUserModel, b: ArticleWithUserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['updated'];
        const b_factor =  b['updated'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    }
  },
  CREATE_DATE: {
    label: '登録日',
    value: 'created',
    sortFunc: function(isAsc: boolean): (a: ArticleWithUserModel, b: ArticleWithUserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['created'];
        const b_factor =  b['created'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    }
  },
  USER_ID: {
    label: 'ユーザID',
    value: 'author',
    sortFunc: function(isAsc: boolean): (a: ArticleWithUserModel, b: ArticleWithUserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['author']['userId'];
        const b_factor =  b['author']['userId'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    }
  },
};

const OrderFactors = {
  ASC: {
    label: '昇順',
    value: true
  },
  DESC: {
    label: '降順',
    value: false
  },
};

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  // TODO 定数科
  public DEFAULT_PER_PAGE = 20;
  public DEFAILT_PER_PAGES = [20, 50, 100];
  public seaerchConditions: any;
  public articles: Array<ArticleWithUserModel>;
  public articlesPerPage: Subject<Array<ArticleWithUserModel>> = new Subject<Array<ArticleWithUserModel>>();
  public showPrograssBar: Boolean = false;
  public sortFactors = SortFactors;
  public sortFactorKeys = Object.keys(SortFactors);
  public orderFactors = OrderFactors;
  public orderFactorKeys = Object.keys(OrderFactors);

  // ページング用プロパティ
  // デフォルトは更新日降順
  public selectedSortFactor = SortFactors.UPDATE_DATE;
  public selectedOrderFactor = OrderFactors.DESC;
  public pageSize = this.DEFAULT_PER_PAGE;
  public pageIndex = 0;

  private onDestroy = new Subject();
  @ViewChild(SearchConditionComponent)
  private searchConditionComponent: SearchConditionComponent;
  private mode;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public paginatorService: MatPaginatorIntl,
    private auth: AuthenticationService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    // TODO 子コンポーネントの検索結果取得を待ってから記事検索する
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
          this.showPrograssBar = true;
          // 子コンポーネントの検索条件初期化が終わったらgetArticlesを呼ぶ
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

  getArticles(): void {
    this.showPrograssBar = true;
    const withUser = true;
    switch (this.mode) {
      case Mode.ALL:
        this.articleService
        .get({}, withUser)
        .subscribe(this.onFinishGetArticles.bind(this));
        break;
      case Mode.FAVORITE:
        if (!this.searchConditionComponent) {
          this.showPrograssBar = false;
          return;
        }

        this.seaerchConditions = this.searchConditionComponent.createCondition();
        this.articleService
        .get( this.seaerchConditions, withUser)
        .subscribe(this.onFinishGetArticles.bind(this));
        break;
      case Mode.USER:
        this.route.parent.params
        .takeUntil(this.onDestroy)
        .subscribe( params => {
          const userId = params['_userId'];
          this.articleService
          .get({author: { userId: userId }}, withUser)
          .subscribe(this.onFinishGetArticles.bind(this));
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
            this.articleService
            .get({ voter: user._id.toString()}, withUser)
            .subscribe(this.onFinishGetArticles.bind(this));
          });
        });
        break;
    }
  }

  onFinishGetArticles(articles: Array<ArticleWithUserModel>) {
    this.articles = articles;
    this.showPrograssBar = false;
    setTimeout(function() {
      this.refreshArticlesPerPage(0, this.DEFAULT_PER_PAGE, articles.length);
    }.bind(this), 0);
  }

  isFavoriteMode(): boolean {
    return this.mode && this.mode === Mode.FAVORITE;
  }

  refreshPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshArticlesPerPage();
  }

  // ページングとソートの設定に従って表示する記事をセットする
  refreshArticlesPerPage() {
    const sortSetting = this.selectedSortFactor.sortFunc(this.selectedOrderFactor.value);
    const sroted = this.articles.sort(sortSetting);


    const range = (this.paginatorService as PaginatorService).calcRange(this.pageIndex, this.pageSize, this.articles.length);
    const paged = sroted.slice(range.startIndex, range.endIndex);

    this.articlesPerPage.next(paged);
  }
}
