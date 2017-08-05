import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../shared/article.service';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  providers: [ ArticleService ]
})
export class ArticleListComponent implements OnInit {
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
