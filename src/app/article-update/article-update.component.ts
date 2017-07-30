import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

import { Article } from '../models/article';
import { ArticleService } from '../services/article.service';


@Component({
  selector: 'app-article-update',
  templateUrl: './article-update.component.html',
  styleUrls: ['./article-update.component.css'],
  providers: [ ArticleService ]
})
export class ArticleUpdateComponent implements OnInit {
  article: Article;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
  }


  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.articleService.get(+params['id'])
       .subscribe(article => this.article = article);
    });
  }

  updateArticle(): void {
    this.articleService.update(this.article)
      .subscribe((res: any) => {
        this.goBack();
      });
  }

  goBack(): void {
    this.location.back();
  }

}
