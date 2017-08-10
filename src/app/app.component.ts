import { Component, OnInit } from '@angular/core';

import { CurrentUserService } from './shared/services/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = `Takumon's Blog!`;

  constructor(
    private currentUserService: CurrentUserService
  ) {
  }

  isLogin() {
    return this.currentUserService.getToken();
  }
}
