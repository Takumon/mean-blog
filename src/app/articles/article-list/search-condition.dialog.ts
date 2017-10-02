import { Component, Inject, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';
import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionService } from '../shared/search-condition.service';
import { AuthenticationService } from '../../shared/services/authentication.service';


enum DATE_SEAERCH_PATTERN {
  RANGE,
  LATEST,
}

enum DATE_SEAERCH_LATEST {
  DATE1,
  DATE2,
  DATE3,
  DATE4,
  DATE5,
  DATE6,
  WEEK1,
  WEEK2,
  WEEK3,
  MONTH1,
  MONTH2,
  MONTH3,
}

export { DATE_SEAERCH_PATTERN, DATE_SEAERCH_LATEST };


@Component({
  selector: 'app-search-condition-dialog',
  templateUrl: './search-condition.dialog.html',
  styleUrls: ['./search-condition.dialog.scss'],
})
export class SearchConditionDialogComponent implements OnInit {
  form: SearchConditionModel;
  checklist: Array<any>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<SearchConditionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public auth: AuthenticationService,
    private userService: UserService,
    private searchConditionService: SearchConditionService,
  ) { }


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
}
