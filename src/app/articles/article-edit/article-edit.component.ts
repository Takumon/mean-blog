import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { ArticleModel } from '../shared/article.model';
import { ArticleService } from '../shared/article.service';
import { EditMode } from './edit-mode.enum';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ ArticleService ]
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
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
    private auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    ) {

  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe( params => {
      if ( params['_id']) {
        this.action = '更新';
        this.articleService
          .getOne(this.auth.loginUser.userId, params['_id'])
          .subscribe(article => {
            this.article = article;
          });
      } else {
        this.action = '投稿';
        this.article = new ArticleModel();
        this.article.author = this.auth.loginUser._id;
      }

      this.routeNamesService.name.next(`記事を${this.action}する`);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
          // TODO alertでメッセージを表示
          this.goBack();
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
