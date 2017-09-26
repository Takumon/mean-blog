import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MdSnackBar, MdDialog } from '@angular/material';

import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';
import { VoterListComponent } from './voter-list.component';
import { SearchUserListDialogComponent } from './search-user-list.dialog';


enum Mode {
  ALL,
  FAVORIT,
  USER,
}

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  providers: [ ArticleService ],
})
export class ArticleListComponent implements OnInit {
  static Mode = Mode;
  articles: Array<ArticleWithUserModel>;

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private commentService: CommentService,
    private articleService: ArticleService,
    public auth: AuthenticationService,
    public dialog: MdDialog,
  ) {
  }

  ngOnInit() {
    this.getArticles();
  }

  refreshComments(item: ArticleWithUserModel, event: any) {
    item.comments = event.comments;
  }

  toggleCommentDetail(item: ArticleWithUserModel) {
    item.showCommentDetail = !item.showCommentDetail;
  }

  getArticles(): void {
    this.route.data.subscribe((data: any) => {
      let condition;
      const withUser = true;
      const mode = data['mode'];
      switch (mode) {
        case Mode.ALL:
          this.articleService.get({}, withUser)
          .subscribe(articles => {
            this.articles = articles as Array<ArticleWithUserModel>;
          });
          break;
        case Mode.FAVORIT:
          // TODO 仮の検索條件
          this.articleService.get({
            author: { _id: [ '59a2b2a14c64a51a15fed639', '59a95b9f7399b8e3b28523ba' ] }
          }, withUser)
          .subscribe(articles => {
            this.articles = articles as Array<ArticleWithUserModel>;
          });
          break;
        case Mode.USER:
          this.route.parent.params.subscribe( params => {
            const userId = params['_userId'];
            this.articleService.get(condition = {
              author: { userId: userId }
            }, withUser)
            .subscribe(articles => {
              this.articles = articles as Array<ArticleWithUserModel>;
            });
          });
          break;
      }
    });
  }

  // TODO コメントはプレーンテキスト固定で良いか検討
  createNewComment(item: ArticleWithUserModel) {
    const newComment = new CommentModel();
    newComment.user = this.auth.loginUser._id;
    newComment.articleId = item._id;

    item.newComment = newComment;
  }

  cancelNewComment(item: ArticleWithUserModel) {
    item.newComment = null;
  }

  registerComment(item: ArticleWithUserModel, newComment: CommentModel) {
    this.commentService
      .register(newComment)
      .subscribe(res => {
        this.commentService
          .getOfArticle(newComment.articleId, true)
          .subscribe(comments => {
            this.snackBar.open('コメントしました。', null, {duration: 3000});
            item.newComment = null;
            item.comments = comments;
          });
      });
  }

  registerVote(item: ArticleWithUserModel) {
    this.articleService
      .registerVote(item._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねしました。', null, {duration: 3000});
        this.articleService.getVoteOne(item._id)
          .subscribe(vote => {
            item.vote = vote;
          });
      });
  }

  deleteVote(item: ArticleWithUserModel) {
    this.articleService
      .deleteVote(item._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, {duration: 3000});
        this.articleService.getVoteOne(item._id)
          .subscribe(vote => {
            item.vote = vote;
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

  openVotersList(voters: Array<UserModel>) {
    const dialogRef = this.dialog.open(VoterListComponent, {
      width: '360px',
      data: { voters: voters }
    });
  }

  openUserList() {
    const dialogRef = this.dialog.open(SearchUserListDialogComponent, {
      width: '420px',
      data: { }
    });

  }
}
