import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ContentChild,
  ContentChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  MdSnackBar,
  MdDialog,
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { asap } from 'rxjs/scheduler/asap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/operator/takeUntil';

import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleService } from '../shared/article.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { MarkdownParseService, MARKDOWN_HEADER_CLASS } from '../shared/markdown-parse.service';
import { TocService } from '../../shared/services/toc.service';
import { ScrollService } from '../../shared/services/scroll.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  providers: [ ArticleService ]
})
export class ArticleDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  // HTMLでコメント件数を参照する用
  @ViewChild(CommentListComponent)
  commentListComponent: CommentListComponent;

  @ViewChildren('markdownText') markdownTexts: QueryList<ElementRef>;

  private onDestroy = new Subject();

  activeIndex: number | null = null;
  article: ArticleWithUserModel;
  text: string;
  toc: string;

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

    private routeNamesService: RouteNamesService,
    public auth: AuthenticationService,
    private articleService: ArticleService,
    public dialog: MdDialog,
    private markdownParseService: MarkdownParseService,
    private tocService: TocService,
    private scrollService: ScrollService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.getArticle();
  }

  // markdonwテキストが初期化時に
  // ハッシュタグで指定したhタグまでスクロールする
  ngAfterViewInit() {
    this.markdownTexts.changes
    .takeUntil(this.onDestroy)
    .subscribe((changes: any) => {
      const _headings = document.querySelectorAll('.' + MARKDOWN_HEADER_CLASS);
      const skipNoTocHeadings = (heading: HTMLHeadingElement) => !/(?:no-toc|notoc)/i.test(heading.className);
      const headings = Array.prototype.filter.call(_headings, skipNoTocHeadings);
      this.tocService.genToc(headings);

      if (window.location.hash) {
        // 一旦指定したタイトルにスクロールしてから
        // スクロールイベントを開始する
        let isFirst = true;
        this.route.fragment
          .takeUntil(this.onDestroy)
          .subscribe((fragment: string) => {
            this.scrollToAnchor(fragment);
            if (isFirst) {
              isFirst = false;
              this.tocService.activeItemIndex
              .takeUntil(this.onDestroy)
              .subscribe(index => {
                this.activeIndex = index;
              });
            }
          });


      } else {
        // リロード前にスクロールしている場合
        // 明示的に初期化する
        this.scrollService.scrollToTop();
        this.tocService.activeItemIndex
          .takeUntil(this.onDestroy)
          .subscribe(index => {
            this.activeIndex = index;
          });

        this.route.fragment
          .takeUntil(this.onDestroy)
          .subscribe((fragment: string) => {
            this.scrollToAnchor(fragment);
          });
      }

      // ハッシュタグがある場合は一度指定したタイトルにスクロールしてから
      // スクロールの監視を開始する




    });
  }


  ngOnDestroy() {
    this.tocService.reset();
    this.onDestroy.next();
  }


  getArticle(): void {
    this.route.params.subscribe( params => {
      const userId = params['userId'];
      const _idOfArticle = params['_id'];
      const withUser = true;
      this.articleService.getOne(_idOfArticle, withUser)
      .subscribe(article => {

        if (userId !== article.author.userId) {
          this.router.navigate(['/', article.author.userId, 'articles', article._id]);
        }

        this.article = article as ArticleWithUserModel;
        if (this.article.isMarkdown) {
          const baseUrl = `/${article.author.userId}/articles/${article._id}`;
          const parsed = this.markdownParseService.parse(this.article.body, baseUrl);
          this.text = parsed.text;
          this.toc = parsed.toc;
        } else {
          this.text = this.article.body;
        }
      });
    });
  }

  deleteArticle(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '記事削除',
        message: `記事を削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.articleService.delete(this.article._id)
      .subscribe(article => {
        this.snackBar.open('記事を削除しました。', null, {duration: 3000});
        this.goBack();
      });
    });
  }

  registerVote(): void {
    this.articleService
      .registerVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねしました。', null, {duration: 3000});
        this.articleService.getVoteOne(this.article._id)
          .subscribe(vote => {
            this.article.vote = vote;
          });
      });
  }

  deleteVote(): void {
    this.articleService
      .deleteVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, {duration: 3000});
        this.articleService.getVoteOne(this.article._id)
          .subscribe(vote => {
            this.article.vote = vote;
          });
      });
  }

  containMineVote(votes: Array<UserModel>): boolean {
    if (!votes) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return votes.some(v => _idOfMine === v._id);
  }

  goBack(): void {
    this.location.back();
  }

  calcMarginOfComment(level: number): number {
    return level * 12;
  }

  scrollToAnchor(elementId: string): void {
    const element: any = document.querySelector('#' + elementId);
    if (!element) {
      return;
    }

    const scrollContainer = document.getElementsByTagName('html')[0];
    setTimeout(function() {
      // ヘッダー分下にずらす
      element.classList.remove('highlighted');
      setTimeout(function() {
        scrollContainer.scrollTop = element.offsetTop - 90;
        element.classList.add('highlighted');
      }, 0);
    }, 0);
  }

}
