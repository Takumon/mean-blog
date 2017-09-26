import { Component, Inject, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';

@Component({
  selector: 'app-search-user-list-dialog',
  templateUrl: './search-user-list.dialog.html',
  styleUrls: ['./search-user-list.dialog.scss'],
})
export class SearchUserListDialogComponent implements OnInit {

  users: Array<UserModel>;

  constructor(
    public dialogRef: MdDialogRef<SearchUserListDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private userService: UserService,
  ) { }


  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAll()
    .subscribe(users => {
      this.users = users as Array<UserModel>;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
