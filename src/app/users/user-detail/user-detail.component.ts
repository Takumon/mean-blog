import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  public user: UserModel;

  private onDestroy = new Subject();

  constructor(
    private route: ActivatedRoute,
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
      this.user = user as UserModel;
    });
  }
}
