import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CommentWithArticleModel } from '../../articles/shared/comment-with-article.model';
import { CommentService } from '../../articles/shared/comment.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../shared/user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit, OnDestroy {
  user: UserModel;
  isMine: Boolean;
  sub: Subscription;
  comments: Array<CommentWithArticleModel>;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    private commentService: CommentService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.sub = this.route.parent.params.subscribe( params => {
      const userId = params['_userId'];
      this.userService.getById(userId).subscribe(user => {
        this.isMine = user._id === this.auth.loginUser._id;
        this.user = user as UserModel;
        this.routeNamesService.name.next('');
        this.getComments(this.user);
      });
    });
  }

  getComments(user: UserModel): void {
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
