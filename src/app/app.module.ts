import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ErrorStateMatcher,
} from '@angular/material';
import { Router } from '@angular/router';
import 'hammerjs';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ArticlesModule } from './articles/articles.module';

import { AppHttpInterceptor } from './shared/services/http.interceptor';
import { RouteNamesService } from './shared/services/route-names.service';
import { JwtService } from './shared/services/jwt.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { ScrollSpyService } from './shared/services/scroll-spy.service';
import { ScrollService } from './shared/services/scroll.service';
import { ErrorStateMatcherContainParentGroup } from './shared/services/message.service';
import { TocService } from './shared/services/toc.service';
import { AuthGuard } from './shared/auth.guard';
import { AdminAuthGuard } from './shared/admin-auth.guard';


import { MarkdownParseService } from './shared/services/markdown-parse.service';
import { MessageService } from './shared/services/message.service';
import { MessageBarService } from './shared/services/message-bar.service';
import { ImageService } from './shared/services/image.service';

import { CustomErrorStateMatcher } from './shared/custom-error-state-matcher';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
