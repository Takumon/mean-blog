import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ArticleService } from './services/article.service';
import { ArticlesComponent } from './articles/articles.component';

import { AppRoutingModule } from './app-routing.module';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    ArticleEditComponent,
    ArticleDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent],
})
export class AppModule { }
