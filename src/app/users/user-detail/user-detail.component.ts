import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: UserModel;
  isMine: Boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
  }

  ngOnInit(): void {
    this.getUser();
    this.routeNamesService.name.next('マイページ');
  }

  getUser(): void {
    this.route.params.subscribe( params => {

      const userId = params['_userId'];
      this.userService.getById(userId).subscribe(user => {
        this.isMine = user._id === this.auth.loginUser._id;
        this.user = user as UserModel;
      });
    });
  }

}
