import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorStateMatcher,
} from '@angular/material';
import { Router } from '@angular/router';
import 'hammerjs';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';

import { AppHttpInterceptor } from './shared/services/http.interceptor';
import { RouteNamesService } from './shared/services/route-names.service';
import { JwtService } from './shared/services/jwt.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { LocalStrageService } from './shared/services/local-strage.service';
import { AlertService } from './shared/services/alert.service';
import { ScrollSpyService } from './shared/services/scroll-spy.service';
import { ScrollService } from './shared/services/scroll.service';
import { ErrorStateMatcherContainParentGroup } from './shared/services/message.service';
import { TocService } from './shared/services/toc.service';
import { AuthGuard } from './shared/auth.guard';
import { CustomErrorStateMatcher } from './shared/custom-error-state-matcher';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule, // TODO HttpClientModuleに移行したい
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    SharedModule,

    AppRoutingModule,
    LoginModule,
    ArticlesModule,
    UsersModule,
  ],
  providers: [
    AlertService,
    ScrollSpyService,
    ScrollService,
    TocService,
    RouteNamesService,
    JwtService,
    AuthenticationService,
    LocalStrageService,
    AuthGuard,
    ErrorStateMatcherContainParentGroup,
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
