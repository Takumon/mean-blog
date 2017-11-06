import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './user.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { UserService } from './shared/user.service';

@NgModule({
  declarations: [
    UserComponent,
    CommentListComponent,
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
  ],
})
export class UsersModule { }
