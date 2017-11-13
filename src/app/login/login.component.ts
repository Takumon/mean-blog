import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public passwordChageMode: boolean;
  public isLoginMode: boolean;
  private returnUrl: string;

  constructor(
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const url: String = this.router.url;
    // パスワード変更の場合はログインしたまま表示する
    if (url !== '/passwordChange') {
      this.authenticationService.logout();
    }
  }

  ngOnInit() {
    const url: String = this.router.url;
    // パスワード変更
    if (url === '/passwordChange') {
      this.passwordChageMode = true;
      return;
    }

    this.passwordChageMode = false;

    // 表示しようとしていたURLを保持しておく
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const isLoginMode = !('register' in this.route.snapshot.queryParams);
    this.setLoginMode(isLoginMode);
  }

  setLoginMode(value: boolean): void {
    this.isLoginMode = value;
  }


  private goNextPage() {
    this.snackBar.open('ログインしました。', null, {duration: 3000});
    this.router.navigate([this.returnUrl]);
  }

}
