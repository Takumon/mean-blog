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
  a = '';
  b = 'articles';

  constructor(
    private currentUserService: CurrentUserService
  ) {
  }

  isLogin() {
    return this.currentUserService.getToken();
  }

  user(): UserModel {
    return this.currentUserService.get().user;
  }
}
