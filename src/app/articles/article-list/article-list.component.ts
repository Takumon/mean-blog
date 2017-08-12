import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  providers: [ ArticleService ],
})
export class ArticleListComponent implements OnInit {
  articles: Array<ArticleWithUserModel>;

  constructor(
    private articleService: ArticleService,
  ) {
  }

  ngOnInit() {
    this.getArticles();
  }
  onSelect(): void {
  }

  getArticles(): void {
    const withUser = true;

    this.articleService
      .getAll(withUser)
      .subscribe((res: any) => {
        this.articles = res as Array<ArticleWithUserModel>;
      });
  }
}
