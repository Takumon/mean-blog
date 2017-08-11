import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { Router } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { ArticlesModule } from './articles/articles.module';

import { JwtService } from './shared/services/jwt.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { CurrentUserService } from './shared/services/current-user.service';
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
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    LoginModule,
    ArticlesModule,
  ],
  providers: [
    AlertService,
    JwtService,
    AuthenticationService,
    CurrentUserService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
