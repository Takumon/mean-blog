import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './articles/articles.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleUpdateComponent } from './article-update/article-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  { path: 'articles',  component: ArticlesComponent },
  { path: 'drafts/new',  component: ArticleEditComponent },
  { path: 'drafts/:id/edit',  component: ArticleUpdateComponent },
  { path: 'articles/:id',  component: ArticleDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
