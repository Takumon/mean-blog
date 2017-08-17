import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


import { CurrentUserService } from './shared/services/current-user.service';
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

  isActiveNavbar: Boolean;

  constructor(
    private router: Router,
    private routeNamesService: RouteNamesService,
    private currentUserService: CurrentUserService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.isActiveNavbar = this.isNavbarsUrl();
      window.scrollTo(0, 0);
    });

    this.routeNamesService.name.subscribe(n => this.routeName = n);
  }

  isLogin(): Boolean {
    return !!this.currentUserService.getToken();
  }

  user(): UserModel {
    return this.currentUserService.get().user;
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
    const _id = this.user()._id;

    return url === '/' || url === '/articles' || url === `/${_id}/articles`;
  }

}
