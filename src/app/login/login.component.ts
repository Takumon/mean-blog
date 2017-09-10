import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  isLoginMode: Boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.authenticationService.logout();
  }

  ngOnInit() {
    // 表示しようとしていたURLを保持しておく
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const isLoginMode = !('register' in this.route.snapshot.queryParams);
    this.setLoginMode(isLoginMode);
  }

  setLoginMode(value: Boolean): void {
    this.isLoginMode = value;
  }


  private goNextPage() {
    this.router.navigate([this.returnUrl]);
  }

}
