import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject();
  private user: UserModel;
  private isMine: Boolean;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.parent.params
    .takeUntil(this.onDestroy)
    .subscribe( params => {
      const userId = params['_userId'];
      this.getUser(userId);
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  private getUser(userId: string): void {
    this.userService.getById(userId).subscribe(user => {
      this.isMine = user._id === this.auth.loginUser._id;
      this.user = user as UserModel;
    });
  }
}
