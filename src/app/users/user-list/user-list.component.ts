import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/user.service';
import { UserModel } from '../shared/user.model';
import { Observable } from 'rxjs/Observable';
import { Constant } from '../../shared/constant';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public Constant = Constant;
  public $users: Observable<Array<UserModel>>;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  private getUser(): void {
    this.$users = this.userService.getAll();
  }
}
