import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Constant } from '../../shared/constant';
import { AuthenticationService } from '../../shared/services/authentication.service';

import { CommentWithArticleModel } from '../../articles/shared/comment-with-article.model';
import { CommentService } from '../../articles/shared/comment.service';
import { ReplyService } from '../../articles/shared/reply.service';
import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../shared/user.service';
import { ReplyWithArticleModel } from '../../articles/shared/reply-with-article.model';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit, OnDestroy {
  public Constant = Constant;
  public commentAndReplyList: Array<CommentWithArticleModel>;
  public user: UserModel;

  private onDestroy = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private commentService: CommentService,
    private replyService: ReplyService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.parent.params
    .takeUntil(this.onDestroy)
    .subscribe( params => {
      const userId = params['_userId'];
      this.getUser(userId);
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  private getUser(userId: string): void {
    this.userService.getById(userId).subscribe(user => {
      this.user = user as UserModel;
      this.getComments(this.user);
    });
  }

  private descCreated(a: CommentWithArticleModel, b: CommentWithArticleModel): number {
    if (a.created > b.created) {
      return -1;
    }
    if (a.created < b.created) {
      return 1;
    }
    return 0;
  }

  /**
   * 指定したユーザにひもづくコメントとリプライ両方取得する
   *
   * @param user
   */
  private getComments(user: UserModel): void {
    const withUser = false;
    const withArticle = true;
    const condition = {
      user: {
        _id: user._id
      }
    };

    this.commentService
    .get(condition, withUser, withArticle)
    .subscribe(comments => {
      const commentAndReplyList = comments as Array<CommentWithArticleModel>;

      this.replyService
      .get(condition, withUser, withArticle)
      .subscribe(replies => {
        const _replies = replies as Array<ReplyWithArticleModel>;
        _replies.forEach(rep => {
          commentAndReplyList.push(rep as CommentWithArticleModel);
        });

        this.commentAndReplyList = commentAndReplyList.sort(this.descCreated);
      });
    });
  }
}
