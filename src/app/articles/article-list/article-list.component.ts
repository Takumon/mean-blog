import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';

import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  providers: [ ArticleService ],
})
export class ArticleListComponent implements OnInit {
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


  getArticles(): void {
    this.route.params.subscribe( params => {

      // TODO URLで条件分岐するのは、設計として良いのか？？
      let condition;
      if (this.router.url === '/') {
        // TODO 仮の検索條件
        condition = { $or: [
          {author: '598fdb30f2962420aedca7a0'},
          {author: '598dca120ad06672f2d26ab3'}
        ]};
      } else if (params['_userId']) {

        condition = { author: params['_userId'] };
      } else {

        condition = {};
      }

      const withUser = true;

      this.articleService.get(condition, withUser)
       .subscribe(articles => {
         this.articles = articles as Array<ArticleWithUserModel>;
      });
    });
  }

  // TODO コメントはプレーンテキスト固定で良いか検討
  createNewComment(item: ArticleWithUserModel) {
    const newComment = new CommentModel();
    newComment.user = this.auth.loginUser._id;
    newComment.articleId = item._id;

    item.newComment = newComment;
  }

  deleteNewComment(item: ArticleWithUserModel) {
    item.newComment = null;
  }

  registerComment(articleId: number, newComment: CommentModel) {
    this.articleService
      .registerComment(newComment)
      .subscribe(res => {
        this.getArticles();
      });
  }
}
