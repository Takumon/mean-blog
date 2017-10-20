import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserService } from './shared/user.service';

@NgModule({
  declarations: [
    UserComponent,
    UserDetailComponent,
    UserEditComponent,
    CommentListComponent,
  ],
  imports: [
    BrowserModule,
    UsersRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    SharedModule,
  ],
  providers: [
    UserService,
  ],
})
export class UsersModule { }
