import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
} from '@angular/material';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';


import { Constant } from '../../shared/constant';
import {
  AuthenticationService,
  MarkdownParseService,
  MessageBarService,
} from '../../shared/services';
import { ConfirmDialogComponent } from '../../shared/components';
import {
  ArticleWithUserModel,
  UserModel,
} from '../../shared/models';

import * as fromArticle from '../../state';
import { SetTitle } from '../../state/app.actions';
import { DraftActionTypes } from '../../drafts/state/draft.actions';
import {
  DeleteArticle,
  DeleteArticleFail,
  LoadArticle,
  ArticleActionTypes,
  DeleteVote,
  DeleteVoteFail,
  AddVote,
  AddVoteFail,
  LoadArticleSuccess
} from '../../state/article.actions';

import { CommentListComponent } from '../comment-list/comment-list.component';
import { ArticleTocComponent } from './article-toc.component';
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements AfterViewInit, OnInit, OnDestroy {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  public article$: Observable<ArticleWithUserModel>;
  public text: string;
  public showToc: Observable<Boolean> = of(false);
  public toc: string;
  public baseUrl: string;

  // HTMLでコメント件数を参照する用
  @ViewChild(CommentListComponent) commentListComponent: CommentListComponent;
  @ViewChildren('markdownText') markdownTexts: QueryList<ElementRef>;
  private onDestroy = new Subject();

  constructor(
    private store: Store<fromArticle.State>,
    private actions$: Actions,
    public auth: AuthenticationService,

    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private markdownParseService: MarkdownParseService,
  ) {
    // エラーメッセージ表示処理を登録
    // 記事削除時
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteArticleFail>(DraftActionTypes.DeleteDraftFail),
      tap(action => this.messageBarService.showValidationError(action.payload.error))
    ).subscribe();

    // いいね追加時
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<AddVoteFail>(ArticleActionTypes.AddVoteFail),
      tap(action => this.messageBarService.showValidationError(action.payload.error))
    ).subscribe();

    // いいね削除時
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteVoteFail>(ArticleActionTypes.DeleteVoteFail),
      tap(action => this.messageBarService.showValidationError(action.payload.error))
    ).subscribe();
  }


  ngOnInit() {
    this.store.dispatch(new SetTitle({title: '記事詳細'}));


    this.route.params.subscribe( params =>
      this.store.dispatch(new LoadArticle({
        id: params['_id'],
        withUser: true
      }))
    );


    this.article$ = this.store.select(fromArticle.getArticle).pipe(
      tap(article => {
        if (!article) {
          return;
        }

        if (article.isMarkdown) {
          this.baseUrl = `/${article.author.userId}/articles/${article._id}`;
          const parsed = this.markdownParseService.parse(article.body, this.baseUrl);
          this.text = parsed.text;
          this.toc = parsed.toc;
        } else {
          this.text = article.body;
        }
      })
    );
  }

  // markdonwテキストが初期化時に
  // ハッシュタグで指定したタグまでスクロールする
  ngAfterViewInit(): void {
    this.showToc = this.markdownTexts.changes
      .pipe(
        takeUntil(this.onDestroy),
        map((change: any) => !!change)
      );
  }


  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
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

      this.store.dispatch(new DeleteArticle());
    });

  }

  private registerVote(): void {
    this.store.dispatch(new AddVote({
      _idOfVoter: this.auth.loginUser._id
    }));
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

      this.store.dispatch(new DeleteVote({
        _idOfVoter: this.auth.loginUser._id
      }));
    });
  }

  private isMine(article: ArticleWithUserModel) {
    if (!article) {
      return false;
    }

    if (!this.auth.isLogin()) {
      return false;
    }

    return this.auth.loginUser.userId === article.author.userId;
  }

  private containMineVote(votes: Array<UserModel>): boolean {
    if (!votes) {
      return false;
    }

    if (!this.auth.isLogin()) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return votes.some(v => _idOfMine === v._id);
  }
}
