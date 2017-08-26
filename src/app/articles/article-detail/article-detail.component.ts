import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';


import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CommentModel } from '../shared/comment.model';
import { ArticleService } from '../shared/article.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserService } from '../../users/shared/user.service';
import { UserModel } from '../../users/shared/user.model';
import { RouteNamesService } from '../../shared/services/route-names.service';


@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  providers: [ ArticleService ]
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleWithUserModel;
  newComment: CommentModel;
  loginUser: UserModel;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public auth: AuthenticationService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.refreshArticle();
  }

  refreshArticle(): void {
    this.route.params.subscribe( params => {
      const withUser = true;
      this.articleService.getOne(+params['id'], withUser)
       .subscribe(article => {
         this.article = article as ArticleWithUserModel;
         this.refreshComment(article.articleId);
      });
    });
  }


  refreshComment(articleId: number): void {
    this.newComment = new CommentModel();
    this.newComment.user = this.auth.loginUser._id;
    this.newComment.isMarkdown = true;
  }

  deleteArticle(): void {
    this.articleService.delete(this.article.articleId)
      .subscribe(article => {
        this.goBack();
      });
  }


  registerComment(): void {
    this.articleService
      .registerComment(this.article.articleId, this.newComment)
      .subscribe(res => {
        this.refreshArticle();
      });
  }

  updateComment(comment): void {
    this.articleService
      .updateComment(this.article.articleId, comment)
      .subscribe(res => {
        this.refreshArticle();
      });
  }

  deleteComment(commentId: String): void {
    this.articleService
      .deleteComment(this.article.articleId, commentId)
      .subscribe(res => {
        this.refreshArticle();
      });
  }


  goBack(): void {
    this.location.back();
  }

}
