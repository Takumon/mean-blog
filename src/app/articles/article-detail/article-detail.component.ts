import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CommentModel } from '../shared/comment.model';
import { CommentWithUserModel } from '../shared/comment-with-user.model';
import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { RouteNamesService } from '../../shared/services/route-names.service';


@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  providers: [ ArticleService ]
})
export class ArticleDetailComponent implements OnInit {
  REPLY_COMMENT_INDENT_MARGIN: Number = 42;

  article: ArticleWithUserModel;
  comments: Array<CommentWithUserModel>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

    private routeNamesService: RouteNamesService,
    public auth: AuthenticationService,
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.getArticle();
    this.refreshComments();
  }


  getArticle(): void {
    this.route.params.subscribe( params => {
      const _idOfArticle = params['_id'];
      const withUser = true;
      this.articleService.getOne(_idOfArticle, withUser)
      .subscribe(article => {
        this.article = article as ArticleWithUserModel;
      });
    });
  }

  refreshComments(): void {
    this.route.params.subscribe( params => {
      const _idOfArticle = params['_id'];
      const withUser = true;
      this.commentService.getOfArticle(_idOfArticle, withUser)
        .subscribe(comments => {
          this.comments = comments as Array<CommentWithUserModel>;
        });
    });
  }


  commentOfForm(commentWithUserModel: CommentWithUserModel = null, parentId: string = null): CommentModel {
    // 追加の場合
    if (commentWithUserModel === null) {
      const newComment = new CommentModel();
      newComment.user = this.auth.loginUser._id;
      newComment.articleId = this.article._id;
      newComment.parentId = parentId;
      return newComment;
    }

    // 更新の場合（差分更新なので必要なのは_idとテキスト情報のみ）
    const commentModel = new CommentModel();
    commentModel._id = commentWithUserModel._id;
    commentModel.text = commentWithUserModel.text;
    commentModel.created = commentWithUserModel.created;
    return commentModel;
  }

  calcMarginOfComment(depth: number): number {
    const d: number = depth > 4 ? 4 : depth;
    return d * 24;
  }

  deleteArticle(): void {
    this.articleService.delete(this.article._id)
      .subscribe(article => {
        this.goBack();
      });
  }


  deleteComment(commentId: String): void {
    this.articleService
      .deleteComment(commentId)
      .subscribe(res => {
        this.refreshComments();
      });
  }


  goBack(): void {
    this.location.back();
  }

}
