import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';

import { Constant } from '../../shared/constant';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';
import { MessageBarService } from '../../shared/services/message-bar.service';

import { UserModel } from '../../users/shared/user.model';
import { ArticleService, VoteCudResponse } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CommentModel } from '../shared/comment.model';
import { CommentWithUserModel } from '../shared/comment-with-user.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleComponent {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  /** 本コンポーネントに表示する記事はinputとして外部から受け取る */
  @Input() item: ArticleWithUserModel;

  /** コンストラクタ */
  constructor(
    public auth: AuthenticationService,
    public messageService: MessageService,

    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private messageBarService: MessageBarService,
    public commentService: CommentService,
    private articleService: ArticleService,
  ) {
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
   * いいねを登録する.<br>
   */
  registerVote() {
    this.articleService
    .registerVote(this.item._id, this.auth.loginUser._id)
    .subscribe( (res: VoteCudResponse) => {
      this.snackBar.open(res.message, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
      this.refreshVotes();
    }, this.onValidationError.bind(this));
  }

  /**
   * 記事に紐づくいいねを取得し画面を更新する.
   */
  private refreshVotes(): void {
    const withUser = true;
    this.articleService.getVote(this.item._id, withUser)
    .subscribe( (vote: UserModel[]) => {
      this.item.vote = vote;
    });
  }


  /**
   * いいねを削除するか確認ダイアログを表示する.
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

      this.deleteVote();
    });
  }

  /**
   * いいねを削除する
   */
  private deleteVote(): void {
    this.articleService
    .deleteVote(this.item._id, this.auth.loginUser._id)
    .subscribe( (res: VoteCudResponse) => {
      this.snackBar.open(res.message, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
      this.refreshVotes();
    }, this.onValidationError.bind(this));
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
