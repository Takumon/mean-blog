import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
  MatInputModule,
} from '@angular/material';

import { Constant } from '../../shared/constant';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';
import { MessageBarService } from '../../shared/services/message-bar.service';

import { UserModel } from '../../users/shared/user.model';
import { ArticleService } from '../shared/article.service';
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
  public Constant = Constant;
  @Input() item: ArticleWithUserModel;


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

  toggleDetail() {
    this.item.showDetail = !this.item.showDetail;
  }


  createNewComment() {
    const newComment = new CommentModel();
    newComment.user = this.auth.loginUser._id;
    newComment.articleId = this.item._id;

    this.item.newComment = newComment;
  }

  cancelNewComment() {
    this.item.newComment = null;
  }


  refreshComments() {
    this.item.newComment = null;

    this.commentService
    .getOfArticle(this.item._id, true)
    .subscribe(comments => {
      this.item.comments = comments as Array<CommentWithUserModel>;
    });
  }

  registerVote() {
    this.articleService
    .registerVote(this.item._id, this.auth.loginUser._id)
    .subscribe(article => {
      this.snackBar.open('いいねしました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
      const withUser = true;
      this.articleService.getVote(this.item._id, withUser)
      .subscribe( (vote: UserModel[]) => {
        this.item.vote = vote;
      });
    }, this.onValidationError.bind(this));
  }


  deleteVote() {
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

      this.articleService
      .deleteVote(this.item._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        const withUser = true;
        this.articleService.getVote(this.item._id)
        .subscribe((vote: UserModel[]) => {
          this.item.vote = vote;
        });
      }, this.onValidationError.bind(this));
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


  containMineVote(): boolean {
    if (!this.item.vote) {
      return false;
    }

    if (!this.auth.isLogin()) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return this.item.vote.some(v => _idOfMine === v._id);
  }
}
