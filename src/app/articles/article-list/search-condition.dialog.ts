import { Component, Inject, OnInit} from '@angular/core';
import {
  MdDialog,
  MdDialogRef,
  MD_DIALOG_DATA
} from '@angular/material';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';
import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionService } from '../shared/search-condition.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { KeysPipe } from '../../shared/pipes/keys.pipe';


@Component({
  selector: 'app-search-condition-dialog',
  templateUrl: './search-condition.dialog.html',
  styleUrls: ['./search-condition.dialog.scss'],
})
export class SearchConditionDialogComponent implements OnInit {
  form: SearchConditionModel;
  checklist: Array<any>;
  dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  constructor(
    public dialogRef: MdDialogRef<SearchConditionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public auth: AuthenticationService,
    private userService: UserService,
    private searchConditionService: SearchConditionService,
  ) {
  }


  ngOnInit() {
    this.cerateForm();
  }

  cerateForm() {
    // TODO ページング
    if (this.data.idForUpdate) {
      const withUser = false;

      this.searchConditionService
        .getById(this.data.idForUpdate, withUser)
        .subscribe(conditionForUpdate => {
          this.form = conditionForUpdate;
          const checkedUsers: Array<string> = this.form.users;

          this.userService.getAll()
            .subscribe(users => {
              this.checklist = users.map(user => {
                const _id = user._id.toString();
                const checked = checkedUsers.indexOf(_id) !== -1;

                return {
                  _id: _id,
                  checked: checked,
                  user: user
                };
              });
            });
        });
    } else {
      this.form = new SearchConditionModel();
      this.form.author = this.auth.loginUser._id.toString();
      this.userService.getAll()
        .subscribe(users => {
          this.checklist = users.map(user => {
            return {
              _id: user._id,
              checked: false, // 全てチェックオフ
              user: user
            };
          });
        });

    }
  }

  validate() {
    this.form.users = this.checklist
      .filter(c => c.checked)
      .map(c => c._id);

  }

  close(): void {
    this.dialogRef.close();
  }

  resetDateSearchPattern() {
    this.form.dateSearchPattern = null;
  }
}
