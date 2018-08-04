import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

import { PaginatorService } from '../shared/services/paginator.service';


import { ArticleService } from './shared/article.service';
import { CommentService } from './shared/comment.service';
import { ReplyService } from './shared/reply.service';
import { SearchConditionService } from './shared/search-condition.service';


import { ExcludeDeletedCommentPipe } from './shared/exclude-deleted-comment.pipe';
import { ExcludeDeletedVoterPipe } from './shared/exclude-deleted-voter.pipe';


import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article-list/article.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleTocComponent } from './article-detail/article-toc.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ReplyFormComponent } from './reply-form/reply-form.component';
import { VoterListComponent } from './voter-list/voter-list.component';
import { SearchConditionDialogComponent } from './search-condition/search-condition.dialog';
import { SearchConditionComponent } from './search-condition/search-condition.component';
import { UserIdSearchFilterPipe } from './search-condition/user-id-search-filter.pip';

import { ArticlesRoutingModule } from './articles-routing.module';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleComponent,
    ArticleDetailComponent,
    ArticleTocComponent,
    CommentListComponent,
    CommentFormComponent,
    ReplyFormComponent,
    VoterListComponent,
    SearchConditionDialogComponent,
    SearchConditionComponent,
    UserIdSearchFilterPipe,
    ExcludeDeletedCommentPipe,
    ExcludeDeletedVoterPipe,
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
    VoterListComponent,
    SearchConditionDialogComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ArticlesModule { }
