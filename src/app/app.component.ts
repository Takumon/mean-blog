import { Component, OnInit } from '@angular/core';

import { CurrentUserService } from './shared/services/current-user.service';
import { UserModel } from './users/shared/user.model';
import { NavLinkModel } from './shared/models/nav-link.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  navLinks: Array<NavLinkModel>;

  constructor(
    private currentUserService: CurrentUserService
  ) {
    this.navLinks = [];
    // TODO お気に入り用URL作成
    this.navLinks.push(new NavLinkModel(
      'お気に入り',
      '/',
      'fa-star',
    ));
    this.navLinks.push(new NavLinkModel(
      '記事一覧',
      '/articles',
      'fa-list',
    ));
  }

  isLogin() {
    return this.currentUserService.getToken();
  }

  user(): UserModel {
    return this.currentUserService.get().user;
  }
}
