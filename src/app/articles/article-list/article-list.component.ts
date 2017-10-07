import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {
  MdSnackBar,
  MdDialog,
  MdInputModule,
} from '@angular/material';
import * as moment from 'moment';

import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';
import { VoterListComponent } from './voter-list.component';
import { LocalStrageService, KEY } from '../../shared/services/local-strage.service';
import { SearchConditionComponent } from '../search-condition/search-condition.component';

enum Mode {
  ALL,
  FAVORITE,
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

  @ViewChild(SearchConditionComponent)
  searchConditionComponent: SearchConditionComponent;

  Modes: typeof Mode = Mode;
  mode;
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
    // TODO 子コンポーネントの検索結果取得を待ってから記事検索する
    this.route.data.subscribe((data: any) => {
      this.mode = data['mode'];
      switch (this.mode) {
        case Mode.ALL:
        case Mode.USER:
          this.getArticles();
          break;
        case Mode.FAVORITE:
          // Do nothing
          // 子コンポーネントの検索条件初期化が終わったらgetArticlesを呼ぶ
          break;
      }
    });

  }

  refreshComments(item: ArticleWithUserModel, event: any) {
    item.comments = event.comments;
  }

  toggleCommentDetail(item: ArticleWithUserModel) {
    item.showCommentDetail = !item.showCommentDetail;
  }

  getArticles(): void {
    let condition;
    const withUser = true;
    switch (this.mode) {
      case Mode.ALL:
        this.articleService.get({}, withUser)
        .subscribe(articles => {
          this.articles = articles as Array<ArticleWithUserModel>;
        });
        break;
      case Mode.FAVORITE:
        if (!this.searchConditionComponent) {
          return;
        }
        const cond = this.searchConditionComponent.createCondition();
        this.articleService.get(
          cond,
          withUser)
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
  }


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
}
