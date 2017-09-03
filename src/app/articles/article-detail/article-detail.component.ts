import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleService } from '../shared/article.service';
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
  article: ArticleWithUserModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

    private routeNamesService: RouteNamesService,
    public auth: AuthenticationService,
    private articleService: ArticleService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next(`記事詳細`);
    this.getArticle();
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

  deleteArticle(): void {
    this.articleService.delete(this.article._id)
      .subscribe(article => {
        this.goBack();
      });
  }

  goBack(): void {
    this.location.back();
  }

}
