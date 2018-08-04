import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent, ArticleSearchMode } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleListComponent,
    pathMatch: 'full',
    data: {mode: ArticleSearchMode.FAVORITE},
  },
  {
    path: 'articles',
    component: ArticleListComponent,
    data: {mode: ArticleSearchMode.ALL},
  },
  {
    path: ':userId/articles/:_id',
    component: ArticleDetailComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ArticlesRoutingModule {}
