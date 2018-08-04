import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';

import { Constant } from '../../shared/constant';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';


import { CommentModel } from '../shared/comment.model';
import { CommentWithUserModel } from '../shared/comment-with-user.model';
import { CommentService } from '../shared/comment.service';
import { ReplyService } from '../shared/reply.service';
import { ReplyModel } from '../shared/reply.model';
import { ReplyWithUserModel } from '../shared/reply-with-user.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  @Input() replyCommentIndentMargin: Number = 42;
  @Input() replyCommentIndentLimit: Number = 4;
  @Input() _idOfArticle: string;
  @Input() comments: CommentWithUserModel[];
  @Output() refresh = new EventEmitter();


  constructor(
    public snackBar: MatSnackBar,
    public auth: AuthenticationService,
    public commentService: CommentService,
    private replyService: ReplyService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if (!this._idOfArticle) {
      throw new Error(`Attribute '_idOfArticle' is required`);
    }

    if (!this.comments) {
      this.refreshComments();
    }
  }


  refreshComments(): void {
    const withUser = true;
    this.commentService
      .getOfArticle(this._idOfArticle, withUser)
      .subscribe(comments => {
        this.comments = comments as CommentWithUserModel[];
        this.refresh.emit({comments: comments});
      });
  }

  commentOfForm(commentWithUserModel: CommentWithUserModel = null): CommentModel {
    // 追加の場合
    if (commentWithUserModel === null) {
      const newComment = new CommentModel();
      newComment.user = this.auth.loginUser._id;
      newComment.articleId = this._idOfArticle;
      return newComment;
    }

    // 更新の場合（差分更新なので必要なのは_idとテキスト情報のみ）
    const commentModel = new CommentModel();
    commentModel._id = commentWithUserModel._id;
    commentModel.text = commentWithUserModel.text;
    commentModel.created = commentWithUserModel.created;
    return commentModel;
  }

  replyOfForm(comment: CommentWithUserModel, isReplyToReoly: boolean, replyWithUserModel: ReplyWithUserModel = null): ReplyModel {
    // 追加の場合
    if (replyWithUserModel === null) {
      const newReply = new ReplyModel();
      newReply.user = this.auth.loginUser._id;
      newReply.articleId = this._idOfArticle;
      newReply.commentId = comment._id;
      newReply.text = isReplyToReoly ? `> ${comment.user.userId} さん\n` : '';
      return newReply;
    }

    // 更新の場合（差分更新なので必要なのは_idとテキスト情報のみ）
    const replyModel = new ReplyModel();
    replyModel._id = replyWithUserModel._id;
    replyModel.text = replyWithUserModel.text;
    replyModel.created = replyWithUserModel.created;
    return replyModel;
  }


  deleteComment(commentId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'コメント削除',
        message: `コメントを削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.commentService
      .delete(commentId)
      .subscribe(res => {
        this.snackBar.open('コメントを削除しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        this.refreshComments();
      });
    });
  }

  deleteReply(replyId: String): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'リプライ削除',
        message: `リプライを削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.replyService
      .delete(replyId)
      .subscribe(res => {
        this.snackBar.open('リプライを削除しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        this.refreshComments();
      });
    });
  }
}
