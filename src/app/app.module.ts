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
import { JwtTokenService } from './shared/services/jwt-token.service';
import { AlertService } from './shared/services/alert.service';
import { AuthGuard } from './shared/auth.guard';

import { AlertComponent } from './shared/directives/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent
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
    UsersModule,
    ArticlesModule,
  ],
  providers: [
    AlertService,
    RouteNamesService,
    JwtService,
    AuthenticationService,
    JwtTokenService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
