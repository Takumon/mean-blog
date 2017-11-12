import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatPaginatorIntl } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { PaginatorService } from '../shared/services/paginator.service';


import { ArticleService } from './shared/article.service';
import { CommentService } from './shared/comment.service';
import { ReplyService } from './shared/reply.service';
import { MarkdownParseService } from './shared/markdown-parse.service';
import { SearchConditionService } from './shared/search-condition.service';
import { DraftService } from './shared/draft.service';

import { AppDateAdapter } from '../shared/app-date-adapter';
import { CheckedListPipe } from '../shared/pipes/checked-list.pipe';
import { NotCheckedListPipe } from '../shared/pipes/not-checked-list.pipe';
import { KeysPipe } from '../shared/pipes/keys.pipe';
import { SharedService } from '../shared/services/shared.service';
import { MessageService } from '../shared/services/message.service';
import { MessageBarService } from '../shared/services/message-bar.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { RouteNamesService } from '../shared/services/route-names.service';
import { ImageService } from '../shared/services/image.service';

import { MarkdownParsePipe } from './shared/markdown-parse.pipe';
import { OrderByPipe } from './shared/orderby.pipe';
import { ExcludeDeletedCommentPipe } from './shared/exclude-deleted-comment.pipe';
import { ExcludeDeletedVoterPipe } from './shared/exclude-deleted-voter.pipe';
import { SafeHtmlPipe } from './shared/safe-html.pipe';


import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article-list/article.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleTocComponent } from './article-detail/article-toc.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ReplyFormComponent } from './reply-form/reply-form.component';
import { VoterListComponent } from './voter-list/voter-list.component';
import { SearchConditionDialogComponent } from './search-condition/search-condition.dialog';
import { SearchConditionComponent } from './search-condition/search-condition.component';
import { UserIdSearchFilterPipe } from './search-condition/user-id-search-filter.pip';
import { DraftListComponent } from './draft-list/draft-list.component';
import { DraftDetailComponent } from './draft-detail/draft-detail.component';

import { ArticlesRoutingModule } from './articles-routing.module';




@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
    ArticleTocComponent,
    CommentListComponent,
    CommentFormComponent,
    ReplyFormComponent,
    VoterListComponent,
    SearchConditionDialogComponent,
    SearchConditionComponent,
    MarkdownParsePipe,
    UserIdSearchFilterPipe,
    OrderByPipe,
    ExcludeDeletedCommentPipe,
    ExcludeDeletedVoterPipe,
    KeysPipe,
    CheckedListPipe,
    NotCheckedListPipe,
    SafeHtmlPipe,
    DraftListComponent,
    DraftDetailComponent,
  ],
  imports: [
    BrowserModule,
    ArticlesRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
  ],
  providers: [
    SharedService,
    MessageService,
    MessageBarService,
    AuthenticationService,
    RouteNamesService,
    ImageService,

    ArticleService,
    CommentService,
    ReplyService,
    MarkdownParseService,
    SearchConditionService,
    DraftService,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MatPaginatorIntl, useClass: PaginatorService},
  ],
  entryComponents: [
    VoterListComponent,
    SearchConditionDialogComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ArticlesModule { }
