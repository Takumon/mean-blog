import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { UsersRoutingModule } from './users-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserService } from './shared/user.service';

@NgModule({
  declarations: [
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    UsersRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    UserService,
  ],
})
export class UsersModule { }
