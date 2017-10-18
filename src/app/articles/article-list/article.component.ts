import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {
  MatSnackBar,
  MatDialog,
  MatInputModule,
} from '@angular/material';

import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CommentModel } from '../shared/comment.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleComponent {
  @Input() item: ArticleWithUserModel;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private commentService: CommentService,
    private articleService: ArticleService,
  ) {
  }

  refreshComments(event: any) {
    this.item.comments = event.comments;
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

  registerComment(newComment: CommentModel) {
    this.commentService
    .register(newComment)
    .subscribe(res => {
      this.commentService
      .getOfArticle(newComment.articleId, true)
      .subscribe(comments => {
        this.snackBar.open('コメントしました。', null, {duration: 3000});
        this.item.newComment = null;
        this.item.comments = comments;
      });
    });
  }

  registerVote() {
    this.articleService
    .registerVote(this.item._id, this.auth.loginUser._id)
    .subscribe(article => {
      this.snackBar.open('いいねしました。', null, {duration: 3000});
      this.articleService.getVoteOne(this.item._id)
      .subscribe(vote => {
        this.item.vote = vote;
      });
    });
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
        this.snackBar.open('いいねを取り消しました。', null, {duration: 3000});
        this.articleService.getVoteOne(this.item._id)
        .subscribe(vote => {
          this.item.vote = vote;
        });
      });
    });
  }

  containMineVote(): boolean {
    if (!this.item.vote) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return this.item.vote.some(v => _idOfMine === v._id);
  }
}
