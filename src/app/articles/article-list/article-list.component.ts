import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';


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
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private articleService: ArticleService,
    public auth: AuthenticationService,
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

  registerComment(newComment: CommentModel) {
    this.articleService
      .registerComment(newComment)
      .subscribe(res => {
        this.getArticles();
      });
  }
}
