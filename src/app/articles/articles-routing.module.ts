import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent, ArticleSecrchMode } from './article-list/article-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { DraftListComponent } from './draft-list/draft-list.component';
import { DraftDetailComponent } from './draft-detail/draft-detail.component';
import { AuthGuard } from '../shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ArticleListComponent,
    pathMatch: 'full',
    data: {mode: ArticleSecrchMode.FAVORITE},
  },
  {
    path: 'articles',
    component: ArticleListComponent,
    data: {mode: ArticleSecrchMode.ALL},
  },
  {
    path: 'drafts/new',
    component: ArticleEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'drafts',
    component: DraftListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':_id',
        component: DraftDetailComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'drafts/:_id/edit',
    component: ArticleEditComponent,
    canActivate: [AuthGuard]
  },

  {
    path: ':userId/articles/:_id',
    component: ArticleDetailComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
  exports: [ RouterModule ]
})
export class ArticlesRoutingModule {}
