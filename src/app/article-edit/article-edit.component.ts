import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../models/article';
import { ArticleService } from '../services/article.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ ArticleService ]
})
export class ArticleEditComponent implements OnInit {
  newArticle: Article;

  constructor(
    private articleService: ArticleService,
    private router: Router) {
  }

  ngOnInit() {
    this.newArticle = new Article();
  }

  registerArticle(): void {
    if (!this.newArticle.title || !this.newArticle.body) {
      return;
    }

    this.articleService
      .register(this.newArticle.title, this.newArticle.body)
      .subscribe((res: any) => {
        this.router.navigate(['articles']);
      });
  }
}
