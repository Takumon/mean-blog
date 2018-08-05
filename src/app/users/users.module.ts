import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';


import { PaginatorService } from '../shared/services';


import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';


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
    { provide: MatPaginatorIntl, useClass: PaginatorService},
  ],
})
export class UsersModule { }
