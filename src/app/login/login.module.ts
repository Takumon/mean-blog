import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './loginForm/login-form.component';
import { RegisterFormComponent } from './registerForm/register-form.component';
import { PasswordFormComponent } from './passwordForm/password-form.component';



@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PasswordFormComponent,
  ],
  imports: [
    LoginRoutingModule,

    SharedModule,
  ],
})
export class LoginModule { }
