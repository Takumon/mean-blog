import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  providers: [ ArticleService ]
})
export class ArticlesComponent implements OnInit {
  articles: Array<any>;

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
    this.getArticles();
  }
  onSelect(): void {
  }

  getArticles(): void {
    this.articleService
      .getAll()
      .subscribe((res: any) => {
        this.articles = res;
      });
  }
}
