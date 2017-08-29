import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ArticleService } from './shared/article.service';
import { MarkdownParseService } from './shared/markdown-parse.service';
import { MarkdownParsePipe } from './shared/markdown-parse.pipe';
import { OrderByPipe } from './shared/orderby.pipe';
import { AutofocusDirective } from '../shared/directives/autofocus.directive';



import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { CommentFormComponent } from './comment-form/comment-form.component';

@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
    CommentFormComponent,
    MarkdownParsePipe,
    OrderByPipe,
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
    MarkdownParseService,
  ],
})
export class ArticlesModule { }
