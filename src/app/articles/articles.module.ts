import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ArticleService } from './shared/article.service';
import { CommentService } from './shared/comment.service';
import { MarkdownParseService } from './shared/markdown-parse.service';
import { MarkdownParsePipe } from './shared/markdown-parse.pipe';
import { OrderByPipe } from './shared/orderby.pipe';
import { ExcludeDeletedLeafCommentPipe } from './shared/exclude-deleted-leaf-comment.pipe';
import { ExcludeDeletedCommentPipe } from './shared/exclude-deleted-comment.pipe';
import { AutofocusDirective } from '../shared/directives/autofocus.directive';



import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { VoterListComponent } from './article-list/voter-list.component';


@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
    CommentListComponent,
    CommentFormComponent,
    VoterListComponent,
    MarkdownParsePipe,
    OrderByPipe,
    ExcludeDeletedLeafCommentPipe,
    ExcludeDeletedCommentPipe,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    ArticlesRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ArticleService,
    CommentService,
    MarkdownParseService,
  ],
  entryComponents: [VoterListComponent]
})
export class ArticlesModule { }
