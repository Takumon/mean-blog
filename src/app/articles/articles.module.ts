import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatTabsModule,
  MdInputModule,
  MatRadioModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCardModule,
  MatListModule,
} from '@angular/material';
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
import { SearchConditionService } from './shared/search-condition.service';
import { KeysPipe } from '../shared/pipes/keys.pipe';



import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { VoterListComponent } from './article-list/voter-list.component';
import { SearchConditionDialogComponent } from './search-condition/search-condition.dialog';
import { SearchConditionComponent } from './search-condition/search-condition.component';




@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
    CommentListComponent,
    CommentFormComponent,
    VoterListComponent,
    SearchConditionDialogComponent,
    SearchConditionComponent,
    MarkdownParsePipe,
    OrderByPipe,
    ExcludeDeletedLeafCommentPipe,
    ExcludeDeletedCommentPipe,
    KeysPipe,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    ArticlesRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MdInputModule,
    MatRadioModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
  ],
  providers: [
    ArticleService,
    CommentService,
    MarkdownParseService,
    SearchConditionService,
  ],
  entryComponents: [
    VoterListComponent,
    SearchConditionDialogComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ArticlesModule { }
