import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { CurrentUserService } from './shared/services/current-user.service';
import { UserModel } from './users/shared/user.model';
import { NavLinkModel } from './shared/models/nav-link.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: String = 'Material Blog';

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {
  }

  isLogin() {
    return this.currentUserService.getToken();
  }

  user(): UserModel {
    return this.currentUserService.get().user;
  }

  isNotEditor(): Boolean {
    return this.router.url !== '/drafts/new';
  }

}
