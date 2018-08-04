import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';


import { PaginatorService } from '../shared/services/paginator.service';

import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './user.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './shared/user.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UserComponent,
    CommentListComponent,
    UserListComponent,
  ],
  imports: [
    UsersRoutingModule,
    SharedModule,
  ],
  providers: [
    UserService,
    { provide: MatPaginatorIntl, useClass: PaginatorService},
  ],
})
export class UsersModule { }
