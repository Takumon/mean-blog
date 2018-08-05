import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

import { PaginatorService } from '../shared/services/paginator.service';


import { ArticleService } from './shared/article.service';
import { CommentService } from './shared/comment.service';
import { ReplyService } from './shared/reply.service';
import { SearchConditionService } from './shared/search-condition.service';


import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleTocComponent } from './article-detail/article-toc.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ReplyFormComponent } from './reply-form/reply-form.component';
import { VoterListComponent } from './voter-list/voter-list.component';

import { ArticlesRoutingModule } from './articles-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SearchConditionDialogComponent } from './search-condition/search-condition.dialog';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article-list/article.component';
import { SearchConditionComponent } from './search-condition/search-condition.component';
import { UserIdSearchFilterPipe } from './search-condition/user-id-search-filter.pip';




@NgModule({
  declarations: [
    ArticleDetailComponent,
    ArticleTocComponent,
    CommentListComponent,
    CommentFormComponent,
    ReplyFormComponent,
    VoterListComponent,

    ArticleListComponent,
    ArticleComponent,
    SearchConditionDialogComponent,
    SearchConditionComponent,
    UserIdSearchFilterPipe,
  ],
  imports: [
    ArticlesRoutingModule,
    SharedModule,
  ],
  providers: [
    ArticleService,
    CommentService,
    ReplyService,
    SearchConditionService,
    { provide: MatPaginatorIntl, useClass: PaginatorService},
  ],
  entryComponents: [
    SearchConditionDialogComponent,
    VoterListComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ArticlesModule { }
