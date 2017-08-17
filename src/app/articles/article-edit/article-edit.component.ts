import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { ArticleModel } from '../shared/article.model';
import { ArticleService } from '../shared/article.service';
import { EditMode } from './edit-mode.enum';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ ArticleService ]
})
export class ArticleEditComponent {
  article: ArticleModel;
  action: String;
  EditMode = EditMode;
  editMode: String = EditMode[EditMode.harfPreviewing];

  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;


  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private currentUserService: CurrentUserService,
    private routeNamesService: RouteNamesService,
    ) {
    this.route.params.subscribe( params => {
      if ( params['id']) {
        this.action = '更新';
        this.articleService
          .getOne(+params['id'])
          .subscribe(article => {
            this.article = article;
          });
      } else {
        this.action = '投稿';
        this.article = new ArticleModel();
        this.article.author = this.currentUserService.get().user._id;
      }

      this.routeNamesService.name.next(`記事を${this.action}する`);
    });
  }

  isNew() {
    const target = this.article.articleId;
    return target !== 0 && !target;
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
        .register(this.article)
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
