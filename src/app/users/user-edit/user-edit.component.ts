import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { CurrentUserService } from '../../shared/services/current-user.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  user: UserModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
    this.routeNamesService.name.next('マイページ');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const _id = this.getUserFromLocalStrage()._id;
    this.userService.getById(_id).subscribe(user => {
      this.user = user as UserModel;
    });
  }

  getUserFromLocalStrage(): any {
    return this.currentUserService.get().user;
  }


  updateProfile(): void {
    // TODO 入力チェック

    this.userService
      .update(this.user)
      .subscribe((res: any) => {
        // TODO alertでメッセージを表示
        this.router.navigate(['/', this.user._id, 'profile']);
      });

  }

  onChangeIconFile(event): void {
    const file = event.srcElement.files[0];
    console.log(file);
    this.getBase64(file, base64File => {
      this.user.icon = base64File;
      console.log(base64File);
    });
    console.log(this.user.icon);
  }

  getBase64(file: File, callback: Function) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64File = e.target.result;
      const withoutMediaType = base64File.split(',')[1];
      if (callback) {
        callback(withoutMediaType);
      }
    };
    reader.readAsDataURL(file);
  }

}
