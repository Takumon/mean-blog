import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
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
    MaterialModule,
    AppRoutingModule,
    LoginModule,
    ArticlesModule,
    UsersModule,
  ],
  providers: [
    AlertService,
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
