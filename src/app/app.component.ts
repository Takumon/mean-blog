import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article/article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ArticleService ]
})
export class AppComponent {
  articles: Array<any>;
  title: string;
  body: string;

  constructor(private articleService: ArticleService) {
    this.getArticles();
  }

  getArticles(): void {
    this.articleService
      .getAll()
      .subscribe((res: any) => {
        this.articles = res.articles;
      });
  }

  registerArticle(): void {
    if (!this.title || !this.body) {
      return;
    }

    this.articleService
      .register(this.title, this.body)
      .subscribe((res: any) => {
        this.title = '';
        this.body = '';
        this.getArticles();
      });
  }
}
