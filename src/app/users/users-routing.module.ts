import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { ArticleListComponent, ArticleSecrchMode } from '../articles/article-list/article-list.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { AdminAuthGuard } from '../shared/admin-auth.guard';


const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: ':_userId',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
      },
      {
        path: 'articles',
        component: ArticleListComponent,
        data: {mode: ArticleSecrchMode.USER },
      },
      {
        path: 'comments',
        component: CommentListComponent,
      },
      {
        path: 'votes',
        component: ArticleListComponent,
        data: {mode: ArticleSecrchMode.VOTER },
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule {}
