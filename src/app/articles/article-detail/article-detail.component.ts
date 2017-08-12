import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleService } from '../shared/article.service';
import { CurrentUserService } from '../../shared/services/current-user.service';


@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  providers: [ ArticleService ]
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleWithUserModel;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private currentUserService: CurrentUserService,
  ) {
  }


  ngOnInit(): void {
    this.route.params.subscribe( params => {
      const withUser = true;
      this.articleService.get(+params['id'], withUser)
       .subscribe(article => {
         this.article = article as ArticleWithUserModel;
      });
    });
  }

  deleteArticle(): void {
    this.articleService.delete(this.article.articleId)
      .subscribe(article => {
        this.goBack();
      });
  }

  isMyArticle(): Boolean {
    return this.article.author.userId === this.currentUserService.get().user.userId;
  }

  goBack(): void {
    this.location.back();
  }

}
