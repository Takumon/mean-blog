import { Component, Inject, OnInit} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDatepickerModule,
  MatNativeDateModule,
  DateAdapter,
  NativeDateAdapter,
} from '@angular/material';
import * as moment from 'moment';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { KeysPipe } from '../../shared/pipes/keys.pipe';

import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';

import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionService } from '../shared/search-condition.service';

@Component({
  selector: 'app-search-condition-dialog',
  templateUrl: './search-condition.dialog.html',
  styleUrls: ['./search-condition.dialog.scss'],
})
export class SearchConditionDialogComponent implements OnInit {
  // formグループ化したい
  public form: any;
  public output: any = {};
  public dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  constructor(
    public dialogRef: MatDialogRef<SearchConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthenticationService,
    private userService: UserService,
    private searchConditionService: SearchConditionService,
    private dateAdapter: DateAdapter<NativeDateAdapter>) {
      dateAdapter.setLocale('ja');
  }

  ngOnInit() {
    this.cerateForm();
  }

  cerateForm() {
    // TODO ページング
    if (this.data.idForUpdate) {
      // 更新時
      const withUser = false;

      this.searchConditionService
        .getById(this.data.idForUpdate, withUser)
        .subscribe(conditionForUpdate => {
          this.form = {
            _id: conditionForUpdate._id,
            name: conditionForUpdate.name,
            dateSearchPattern: conditionForUpdate.dateSearchPattern,
          };
          if (this.form.dateSearchPattern
              && (DATE_RANGE_PATTERN.期間指定 === Number(conditionForUpdate.dateSearchPattern)) ) {
            if (conditionForUpdate.dateFrom) {
              this.form['dateFrom'] = new Date(conditionForUpdate.dateFrom);
            }
            if (conditionForUpdate.dateTo) {
              this.form['dateTo'] = new Date(conditionForUpdate.dateTo);
            }
          }

          const checkedUsers: Array<string> = conditionForUpdate.users;

          this.userService.getAll()
            .subscribe(users => {
              this.form['checkUserList'] = users.map(user => {
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
      // 新規登録時
      this.form = {};
      this.userService.getAll()
        .subscribe(users => {
          this.form['checkUserList'] = users.map(user => {
            return {
              _id: user._id,
              checked: false, // 全てチェックオフ
              user: user
            };
          });
        });

    }
  }

  setOutput() {
    this.output.name = this.form.name;
    this.output.author = this.auth.loginUser._id;
    this.output.users = this.form.checkUserList.filter(c => c.checked).map(c => c._id);
    this.output.dateSearchPattern = this.form.dateSearchPattern;

    if (this.form._id) {
      this.output._id = this.form._id;
    }

    if (this.isSpecificDateRange(this.form.dateSearchPattern)) {
      if (this.form.dateFrom) {
        this.output.dateFrom = moment(this.form.dateFrom).startOf('date').toString();
      }
      if (this.form.dateTo) {
        this.output.dateTo = moment(this.form.dateTo).endOf('date').toString();
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  resetDateSearchPattern() {
    this.form.dateSearchPattern = null;
  }

  isSpecificDateRange(pattern: string) {
    return DATE_RANGE_PATTERN.期間指定 === Number(pattern);
  }
}
