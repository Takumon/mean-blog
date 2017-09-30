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

  checklist: Array<any>;

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
      this.checklist = users.map(user => {
        return {
          _id: user._id,
          checked: false,
          user: user
        };
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
