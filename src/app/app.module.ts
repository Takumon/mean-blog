import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, } from '@angular/material';
import { Router } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './shared/auth.guard';
import { AdminAuthGuard } from './shared/admin-auth.guard';
import { SharedModule } from './shared/shared.module';
import { CustomErrorStateMatcher } from './shared/custom-error-state-matcher';
import {
  AuthenticationService,
  ErrorStateMatcherContainParentGroup,
  JwtService,
  RouteNamesService,
  AppHttpInterceptor,
  LocalStorageService,
  MarkdownParseService,
  MessageService,
  MessageBarService,
  ImageService,
} from './shared/services';

import { ArticlesModule } from './articles/articles.module';
import { ScrollSpyService } from './articles/shared/scroll-spy.service';
import { ScrollService } from './articles/shared/scroll.service';
import { TocService } from './articles/shared/toc.service';

import { UserService } from './shared/services/user.service';
import { UsersModule } from './users/users.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    ArticlesModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    UsersModule,
  ],

  providers: [
    ScrollSpyService,
    ScrollService,
    TocService,
    RouteNamesService,
    JwtService,
    AuthenticationService,
    LocalStorageService,
    AuthGuard,
    AdminAuthGuard,
    ErrorStateMatcherContainParentGroup,

    MessageService,
    MessageBarService,
    AuthenticationService,
    RouteNamesService,
    ImageService,
    MarkdownParseService,
    UserService,
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorStateMatcher
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
