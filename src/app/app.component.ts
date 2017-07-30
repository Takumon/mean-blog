import { Component, OnInit } from '@angular/core';
import { ArticleService } from './services/article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ArticleService ]
})
export class AppComponent {
  articles: Array<any>;
  title = `Takumon's Blog!`;

  constructor(private articleService: ArticleService) {
    this.getArticles();
  }

  getArticles(): void {
    this.articleService
      .getAll()
      .subscribe((res: any) => {
        this.articles = res;
      });
  }
}
