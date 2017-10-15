import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { CommentWithArticleModel } from '../../articles/shared/comment-with-article.model';
import { CommentService } from '../../articles/shared/comment.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../shared/user.service';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit, OnDestroy {
  public comments: Array<CommentWithArticleModel>;
  public user: UserModel;

  private onDestroy = new Subject();
  private isMine: Boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private commentService: CommentService,
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
      this.isMine = user._id === this.auth.loginUser._id;
      this.user = user as UserModel;
      this.getComments(this.user);
    });
  }

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
      this.comments = comments as Array<CommentWithArticleModel>;
    });
  }
}
