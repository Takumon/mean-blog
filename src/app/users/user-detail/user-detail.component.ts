import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { CurrentUserService } from '../../shared/services/current-user.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: UserModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public currentUserService: CurrentUserService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
    this.routeNamesService.name.next('マイページ');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.route.params.subscribe( params => {

      const _id = params['_userId'];
      this.userService.getById(_id).subscribe(user => {
        this.user = user as UserModel;
      });
    });
  }

  isMine(): Boolean {
    return this.user._id === this.currentUserService.get()._id;
  }
}
