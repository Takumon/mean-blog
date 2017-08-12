import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../shared/services/authentication.service';
import { IconGeneratorService } from '../shared/services/icon-generator.service';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    LoginRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    AuthenticationService,
    IconGeneratorService,
  ],
})
export class LoginModule { }
