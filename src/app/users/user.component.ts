import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { AuthenticationService } from '../shared/services/authentication.service';
import { RouteNamesService } from '../shared/services/route-names.service';
import { SharedService } from '../shared/services/shared.service';

import { UserModel } from './shared/user.model';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  public user: UserModel;
  public isMine: Boolean;

  private onDestroy = new Subject();
  private param_userId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeNamesService: RouteNamesService,
    private auth: AuthenticationService,
    private sharedService: SharedService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next('');

    // 初回
    this.route.params
    .takeUntil(this.onDestroy)
    .subscribe( params => {
      this.param_userId = params['_userId'];
      this.getUser(this.param_userId);
    });

    // 初回以降　子コンポーネントからの更新時
    this.sharedService.changeEmitted$
    .takeUntil(this.onDestroy)
    .subscribe(text => {
      if ('Change prifile') {
        this.getUser(this.param_userId);
      }
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
