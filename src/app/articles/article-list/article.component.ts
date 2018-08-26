import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
} from '@angular/material';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Constant } from '../../shared/constant';
import { ConfirmDialogComponent } from '../../shared/components';
import {
  AuthenticationService,
  MessageService,
  MessageBarService,
} from '../../shared/services';
import {
  ArticleWithUserModel,
  CommentModel,
  CommentWithUserModel,
} from '../../shared/models';
import { CommentService } from '../shared/comment.service';
import * as fromArticle from '../../state';
import {
  AddVoteOfArticles,
  AddVoteOfArticlesFail,
  ArticleActionTypes,
  DeleteVoteOfArticles,
  DeleteVoteOfArticlesFail
} from '../../state/article.actions';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleComponent implements OnDestroy {

  private onDestroy = new Subject();

  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  /** 本コンポーネントに表示する記事はinputとして外部から受け取る */
  @Input() item: ArticleWithUserModel;

  /** コンストラクタ */
  constructor(
    private store: Store<fromArticle.State>,
    private actions$: Actions,
    public auth: AuthenticationService,
    public messageService: MessageService,

    private dialog: MatDialog,
    private messageBarService: MessageBarService,
    public commentService: CommentService,
  ) {
    // エラーメッセージ表示処理を登録
    // いいね追加時
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<AddVoteOfArticlesFail>(ArticleActionTypes.AddVoteOfArticlesFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();

    // いいね削除時
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteVoteOfArticlesFail>(ArticleActionTypes.DeleteVoteOfArticlesFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * いいねとコメントの詳細部分の表示/非表示を切り替える
   */
  toggleVoteAndCommentDetail(): void {
    this.item.showDetail = !this.item.showDetail;
  }


  /**
   * コメント入力欄を開く時に新しいコメントモデルを生成する
   */
  createNewComment(): void {
    const newComment = new CommentModel();
    newComment.user = this.auth.loginUser._id;
    newComment.articleId = this.item._id;

    this.item.newComment = newComment;
  }

  /**
   * コメント欄を閉じる時に新しいコメントモデルを破棄する
   */
  cancelNewComment(): void {
    this.item.newComment = null;
  }


  /**
   * 記事に紐づくコメントを再取得して画面のコメント情報を更新する.<br>
   * 新しいコメントモデルも破棄する.
   */
  refreshComments() {
    const withUser = true;

    this.commentService
    .getOfArticle(this.item._id, withUser)
    .subscribe(comments => {
      this.item.comments = comments as CommentWithUserModel[];
      this.cancelNewComment();
    });
  }

  /**
   * いいねを登録する.
   */
  registerVote() {
    this.store.dispatch(new AddVoteOfArticles({
      _idOfArticle: this.item._id,
      _idOfVoter: this.auth.loginUser._id
    }));
  }


  /**
   * いいねを削除する.
   */
  confirmeDeleteVote(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '確認',
        message: `いいねを取り消しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.store.dispatch(new DeleteVoteOfArticles({
        _idOfArticle: this.item._id,
        _idOfVoter: this.auth.loginUser._id
      }));
    });
  }


  /**
   * 入力チェック時の共通エラーハンドリング用関数(<b>bindして使用する<b>)<br>
   * bind先は入力チェックkeyと同名のコントローラのgetterを定義すること<br>
   * getterで入力チェックに対応するコントローラが取得できない場合はsnackBarでエラーメッセージを表示する
   */
  onValidationError(error: any): void {
    const noControlErrors = [];
    for (const e of error['errors']) {
      // getterからformControllを取得
      const control: FormControl | FormGroup = this[e.param];
      if (!control) {
        // 該当するfromがないものはスナックバーで表示
        noControlErrors.push(e);
        continue;
      }

      const messages = control.getError('remote');
      if (messages) {
        messages.push(e.msg);
      } else {
        control.setErrors({remote: [e.msg]});
      }
    }

    if (noControlErrors.length > 0) {
      this.messageBarService.showValidationError({errors: noControlErrors});
    }
  }


  /**
   * 記事にログインユーザのいいねが含まれるか.
   */
  containMineVote(): boolean {
    if (!this.item.vote) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return this.item.vote.some(v => _idOfMine === v._id);
  }
}
