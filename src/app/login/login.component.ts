import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserModel } from '../users/shared/user.model';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  message: String;
  user: UserModel;
  user_status: boolean;
  returnUrl: string;
  isLoginMode: Boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.user = new UserModel();
    this.authenticationService.logout();
    this.setLoginMode(true);
  }

  ngOnInit() {
    // 元々表示しようとしていたURLを保持しておく
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  setLoginMode(value: Boolean): void {
    this.isLoginMode = value;
  }


  action(user) {
    if (this.isLoginMode) {
      this.login(user);
    } else {
      this.createAccount(user);
    }
  }

  private login(user) {
    this.authenticationService
      .loginUser(user)
      .subscribe( (res: any) => {
        this.user_status = res.success;
        if (res.success !== true) {
          this.message = res['message'];
          return;
        }

        this.router.navigate([this.returnUrl]);
      });
  }

  private createAccount(user) {
    this.authenticationService
      .registerUser(user)
      .subscribe( (res: any) => {
        this.user_status = res.success;
        if (res.success !== true) {
          this.message = res['message'];
          return;
        }

        this.router.navigate([this.returnUrl]);
      });
  }
}
