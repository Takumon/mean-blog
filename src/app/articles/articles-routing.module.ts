import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

const routes: Routes = [
  { path: 'articles',  pathMatch: 'full', component: ArticleListComponent },
  { path: 'drafts/new',  pathMatch: 'full', component: ArticleEditComponent },
  { path: 'drafts/:id/edit',  component: ArticleEditComponent },
  { path: 'articles/:id',  component: ArticleDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ArticlesRoutingModule {}
