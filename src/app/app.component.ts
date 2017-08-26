import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { AuthenticationService } from './shared/services/authentication.service';
import { RouteNamesService } from './shared/services/route-names.service';
import { UserModel } from './users/shared/user.model';
import { NavLinkModel } from './shared/models/nav-link.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: String = 'Material Blog';
  routeName: String;

  isActiveHeader: Boolean;
  isActiveNavbar: Boolean;

  constructor(
    private router: Router,
    private routeNamesService: RouteNamesService,
    public auth: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.refreshActiveHeader();
      this.refreshActiveNavbar();
      window.scrollTo(0, 0);
    });

    if (this.auth.isLogin()) {
      this.checkLoginState();
    }
    this.routeNamesService.name.subscribe(n => this.routeName = n);
  }

  checkLoginState() {
    this.auth.checkState().subscribe(res => {
      if (res.success !== true) {
        console.log(res.message);
        return;
      }
      // TODO エラー処理

      this.auth.setLoginUser(res.user);
    }, error => {
      // TODO エラー処理
      console.log(error);
    });
  }


  isNotEditor(): Boolean {
    const url = this.router.url;
    return !url.startsWith('/drafts/');
  }

  refreshActiveHeader(): void {
    const url: String = this.router.url;
    // 前方一致
    this.isActiveHeader = ! url.startsWith('/login');
  }

  refreshActiveNavbar(): void {
    const url: String = this.router.url;

    // 完全一致
    if (url === '/' || url === '/articles') {
      this.isActiveNavbar = true;
    } else if (this.auth.loginUser && url === `/${this.auth.loginUser._id}/articles`) {
      this.isActiveNavbar = true;
    } else {
      this.isActiveNavbar = false;
    }
  }

}
