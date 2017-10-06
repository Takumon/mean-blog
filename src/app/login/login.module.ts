import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './loginForm/login-form.component';
import { RegisterFormComponent } from './registerForm/register-form.component';
import { AuthenticationService } from '../shared/services/authentication.service';
import { IconGeneratorService } from '../shared/services/icon-generator.service';
import { MessageService } from '../shared/services/message.service';

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    RegisterFormComponent,
  ],
  imports: [
    BrowserModule,
    LoginRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
  ],
  providers: [
    AuthenticationService,
    IconGeneratorService,
    MessageService,
  ],
})
export class LoginModule { }
