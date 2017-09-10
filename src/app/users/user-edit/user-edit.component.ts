import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RouteNamesService } from '../../shared/services/route-names.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  user: UserModel;

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
    private auth: AuthenticationService,
  ) {
    this.routeNamesService.name.next('マイページ');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.user = this.auth.loginUser;
  }



  updateProfile(): void {
    // TODO 入力チェック

    this.userService
      .update(this.user)
      .subscribe((res: any) => {
        this.snackBar.open('プロフィールを編集しました。', null, {duration: 3000});
        this.router.navigate(['/', this.user.userId, 'profile']);
      });
  }

  onChangeIconFile(event): void {
    const file = event.srcElement.files[0];
    this.getBase64(file, base64File => {
      this.user.icon = base64File;
    });
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
