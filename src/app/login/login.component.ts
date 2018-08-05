import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


import { Constant } from '../shared/constant';
import { RouteNamesService } from '../shared/services/route-names.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private Constant = Constant;
  public passwordChageMode: boolean;
  public isLoginMode: boolean;
  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,

    private authenticationService: AuthenticationService,
    private routeNamesService: RouteNamesService,
  ) {
    const url: String = this.router.url;
    // パスワード変更の場合はログインしたまま表示する
    if (url !== '/login/loginoptions/passwordchange') {
      this.authenticationService.logout();
    }
  }

  ngOnInit() {
    this.routeNamesService.name.next(``);
    const url: String = this.router.url;

    // パスワード変更
    if (url === '/login/loginoptions/passwordchange') {
      this.passwordChageMode = true;
      this.returnUrl = '/dashbord';
      return;
    }

    this.passwordChageMode = false;

    // 表示しようとしていたURLを保持しておく
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashbord';
    const isLoginMode = !('register' in this.route.snapshot.queryParams);
    this.setLoginMode(isLoginMode);
  }

  setLoginMode(value: boolean): void {
    this.isLoginMode = value;
  }


  private goNextPage(msg: string = 'ログインしました。') {
    this.snackBar.open(msg, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
    this.router.navigate([this.returnUrl]);
  }

}
