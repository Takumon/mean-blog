import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatToolbarModule,
  MatTabsModule,
  MatMenuModule,
  MatProgressBarModule,
} from '@angular/material';
import { Router } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';

import { RouteNamesService } from './shared/services/route-names.service';
import { JwtService } from './shared/services/jwt.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { LocalStrageService } from './shared/services/local-strage.service';
import { AlertService } from './shared/services/alert.service';
import { ScrollSpyService } from './shared/services/scroll-spy.service';
import { ScrollService } from './shared/services/scroll.service';
import { TocService } from './shared/services/toc.service';
import { AuthGuard } from './shared/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    ArticlesModule,
    UsersModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    MatProgressBarModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
