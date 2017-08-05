import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import marked from 'marked';
import hljs from 'highlight.js';
import { Article } from '../models/article';
import { ArticleService } from '../services/article.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ ArticleService ]
})
export class ArticleEditComponent implements OnInit {
  article: Article;
  preview: String;
  action: String;
  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;


  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    ) {
    this.route.params.subscribe( params => {
      if ( params['id']) {
        this.action = '更新';
        this.articleService
          .get(+params['id'])
          .subscribe(article => {
            this.article = article;
            this.parseTextAreaToMarkdown();
          });
      } else {
        this.action = '投稿';
        this.article = new Article();
      }
    });
  }

  ngOnInit() {
    marked.setOptions({
      langPrefix: '',
      highlight: function (code, langAndTitle, callback) {
        const lang = langAndTitle ? langAndTitle.split(':')[0] : '';
        return hljs.highlightAuto(code, [lang]).value;
      }
    });
  }

  isNew() {
    return !this.article.articleId;
  }


  parseTextAreaToMarkdown(): void {
    this.preview = marked(this.article.body);
  }

  @HostListener('scroll', ['$event'])
  private syncScroll($event: Event): void {
    const scrollAreaHight = $event.srcElement.scrollHeight - $event.srcElement.clientHeight;
    const ratio = ($event.srcElement.scrollTop / scrollAreaHight);

    const target = this.scrollTarget.nativeElement;
    target.scrollTop = (target.scrollHeight - target.clientHeight) * ratio;
  }

  upsertArticle(): void {
    // TODO 入力チェック
    if (!this.article.title || !this.article.body) {
      return;
    }

    if (this.isNew()) {
      this.articleService
        .register(this.article.title, this.article.body)
        .subscribe((res: any) => {
          this.goBack();
        });
    } else {
      this.articleService
        .update(this.article)
        .subscribe((res: any) => {
          this.goBack();
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
