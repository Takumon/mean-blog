import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

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

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  public seaerchConditions: any;
  public articles: Observable<Array<ArticleWithUserModel>>;
  public showPrograssBar: Boolean = false;

  private onDestroy = new Subject();
  @ViewChild(SearchConditionComponent)
  private searchConditionComponent: SearchConditionComponent;
  private mode;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
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
        this.articles = this.articleService
        .get({}, withUser)
        .do(() => { this.showPrograssBar = false; })
        .share();
        break;
      case Mode.FAVORITE:
        if (!this.searchConditionComponent) {
          this.showPrograssBar = false;
          return;
        }

        this.seaerchConditions = this.searchConditionComponent.createCondition();
        this.articles = this.articleService
        .get( this.seaerchConditions, withUser)
        .do(() => { this.showPrograssBar = false; })
        .share();
        break;
      case Mode.USER:
        this.route.parent.params
        .takeUntil(this.onDestroy)
        .subscribe( params => {
          const userId = params['_userId'];
          this.articles = this.articleService
          .get({author: { userId: userId }}, withUser)
          .do(() => { this.showPrograssBar = false; })
          .share();
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
            this.articles = this.articleService
            .get({ voter: user._id.toString()}, withUser)
            .do(() => { this.showPrograssBar = false; })
            .share();
          });
        });
        break;
    }
  }

  isFavoriteMode(): boolean {
    return this.mode && this.mode === Mode.FAVORITE;
  }
}
