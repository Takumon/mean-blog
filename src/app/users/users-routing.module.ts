import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ArticleListComponent } from '../articles/article-list/article-list.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AuthGuard } from '../shared/auth.guard';


const routes: Routes = [
  {
    path: ':_userId',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'articles',
        component: ArticleListComponent,
        data: {mode: ArticleListComponent.Mode.USER },
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: UserDetailComponent,
      },
      {
        path: 'comments',
        component: CommentListComponent,
      },
      {
        path: 'edit',
        component: UserEditComponent,
      }
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule {}
