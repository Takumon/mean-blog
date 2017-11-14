import { DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/Rx';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { UserModel } from '../../users/shared/user.model';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { MarkdownParseService } from '../shared/markdown-parse.service';
import { ArticleService } from '../shared/article.service';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  public article: ArticleWithUserModel;
  public text: string;
  public showToc: Observable<Boolean> = Observable.of(false);
  public toc: string;
  public baseUrl: string;

  // HTMLでコメント件数を参照する用
  @ViewChild(CommentListComponent) commentListComponent: CommentListComponent;
  @ViewChildren('markdownText') markdownTexts: QueryList<ElementRef>;
  private onDestroy = new Subject();
  private activeIndex: number | null = null;

  constructor(
    private sanitized: DomSanitizer,
    public auth: AuthenticationService,

    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private routeNamesService: RouteNamesService,
    private markdownParseService: MarkdownParseService,
    private articleService: ArticleService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.getArticle();
  }

  // markdonwテキストが初期化時に
  // ハッシュタグで指定したタグまでスクロールする
  ngAfterViewInit(): void {
    this.showToc = this.markdownTexts.changes
      .takeUntil(this.onDestroy)
      .map((change: any) => !!change);
  }


  ngOnDestroy(): void {
    this.onDestroy.next();
  }


  private getArticle(): void {
    this.route.params.subscribe( params => {
      const userId = params['userId'];
      const _idOfArticle = params['_id'];
      const withUser = true;
      this.articleService.getOne(_idOfArticle, withUser)
      .subscribe( (article: ArticleWithUserModel) => {

        if (userId !== article.author.userId) {
          this.router.navigate(['/', article.author.userId, 'articles', article._id]);
        }

        this.article = article as ArticleWithUserModel;
        if (this.article.isMarkdown) {
          this.baseUrl = `/${article.author.userId}/articles/${article._id}`;
          const parsed = this.markdownParseService.parse(this.article.body, this.baseUrl);
          this.text = parsed.text;
          this.toc = parsed.toc;
        } else {
          this.text = this.article.body;
        }
      });
    });
  }

  private deleteArticle(): void {
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
        this.router.navigate(['/']);
      }, this.messageBarService.showValidationError.bind(this.messageBarService));
    });

  }

  private registerVote(): void {
    this.articleService
      .registerVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねしました。', null, {duration: 3000});
        this.articleService.getVoteOne(this.article._id)
          .subscribe(vote => {
            this.article.vote = vote;
          });
      }, this.messageBarService.showValidationError.bind(this.messageBarService));
  }

  private deleteVote(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'いいね取り消し',
        message: `いいねを取り消しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }


      this.articleService
      .deleteVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, {duration: 3000});
        this.articleService.getVoteOne(this.article._id)
        .subscribe(vote => {
          this.article.vote = vote;
        });
      }, this.messageBarService.showValidationError.bind(this.messageBarService));
    });
  }

  private containMineVote(votes: Array<UserModel>): boolean {
    if (!votes) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return votes.some(v => _idOfMine === v._id);
  }
}
