import {
  Component,
  OnInit,
  AfterViewInit,
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


import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleService } from '../shared/article.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { MarkdownParseService } from '../shared/markdown-parse.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  providers: [ ArticleService ]
})
export class ArticleDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(CommentListComponent)
  commentListComponent: CommentListComponent;

  @ViewChildren('markdownText') markdownTexts: QueryList<ElementRef>;

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
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.getArticle();
  }

  // markdonwテキストが初期化時に
  // ハッシュタグで指定したhタグまでスクロールする
  ngAfterViewInit() {
    this.markdownTexts.changes.subscribe((changes: any) => {
      this.route.fragment.subscribe((fragment: string) => {
        this.scrollToAnchor(fragment);
      });
    });
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
    console.log(element);
    if (!element) {
      return;
    }

    const scrollContainer = document.getElementsByTagName('html')[0];
    setTimeout(function() {
      // ヘッダー分下にずらす
      scrollContainer.scrollTop = element.offsetTop - 90;
      element.classList.add('highlighted');
    }, 0);
  }
}
