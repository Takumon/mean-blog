import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { CurrentUserService } from '../../shared/services/current-user.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

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
    private currentUserService: CurrentUserService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.getUser();
    });

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

  getUserFromLocalStrage(): any {
    return this.currentUserService.get().user;
  }
}
