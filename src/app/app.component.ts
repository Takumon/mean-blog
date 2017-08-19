import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './shared/services/current-user.service';
import { UserService } from './users/shared/user.service';
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
  loginUser: UserModel;

  isActiveNavbar: Boolean;

  constructor(
    private router: Router,
    private routeNamesService: RouteNamesService,
    private userService: UserService,
    public currentUserService: CurrentUserService,
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.isActiveNavbar = this.isNavbarsUrl();
      if (this.isLogin()) {
        this.setLoginUser();
      }
      window.scrollTo(0, 0);
    });

    this.routeNamesService.name.subscribe(n => this.routeName = n);
  }

  setLoginUser() {
    this.userService.getLoginUser().subscribe(user => {
      this.loginUser = user;
    }, error => {
      console.log(error);
    });
  }

  isLogin(): Boolean {
    return !!this.currentUserService.getToken();
  }


  isNotEditor(): Boolean {
    const url = this.router.url;
    return !url.startsWith('/drafts/');
  }

  isNavbarsUrl(): Boolean {
    if (!this.isLogin()) {
      return false;
    }


    const url = this.router.url;
    const _id = this.currentUserService.get()._id;

    return url === '/' || url === '/articles' || url === `/${_id}/articles`;
  }

}
