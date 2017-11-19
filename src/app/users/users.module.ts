import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';


import { SharedModule } from '../shared/shared.module';
import { PaginatorService } from '../shared/services/paginator.service';

import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './user.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './shared/user.service';


@NgModule({
  declarations: [
    UserComponent,
    CommentListComponent,
    UserListComponent,
  ],
  imports: [
    BrowserModule,
    UsersRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
  ],
  providers: [
    UserService,
    { provide: MatPaginatorIntl, useClass: PaginatorService},
  ],
})
export class UsersModule { }
