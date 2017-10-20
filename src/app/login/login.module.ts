import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './loginForm/login-form.component';
import { RegisterFormComponent } from './registerForm/register-form.component';



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

    SharedModule,
  ],
})
export class LoginModule { }
