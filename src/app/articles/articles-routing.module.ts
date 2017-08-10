import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { AuthGuard } from '../shared/auth.guard';

const routes: Routes = [
  { path: 'articles', component: ArticleListComponent , canActivate: [AuthGuard] },
  { path: 'drafts/new',  component: ArticleEditComponent, canActivate: [AuthGuard]  },
  { path: 'drafts/:id/edit',  component: ArticleEditComponent, canActivate: [AuthGuard]  },
  { path: 'articles/:id',  component: ArticleDetailComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ArticlesRoutingModule {}
