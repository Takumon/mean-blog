import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { ArticleListComponent, Mode } from '../articles/article-list/article-list.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AuthGuard } from '../shared/auth.guard';


const routes: Routes = [
  {
    path: ':_userId',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
      },
      {
        path: 'articles',
        component: ArticleListComponent,
        data: {mode: Mode.USER },
        canActivate: [AuthGuard]
      },
      {
        path: 'comments',
        component: CommentListComponent,
      },
      {
        path: 'votes',
        component: ArticleListComponent,
        data: {mode: Mode.VOTER },
        canActivate: [AuthGuard]
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule {}
