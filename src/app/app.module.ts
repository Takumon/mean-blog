import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArticleService } from './services/article.service';
import { ArticlesComponent } from './articles/articles.component';

import { AppRoutingModule } from './app-routing.module';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleUpdateComponent } from './article-update/article-update.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
    ArticleUpdateComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent],
})
export class AppModule { }
