import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { SharedService } from '../../shared/services/shared.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  user: UserModel;

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private sharedService: SharedService,
    private userService: UserService,
  ) {
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
        this.sharedService.emitChange('Change prifile');
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
