import { Component, Inject, OnInit} from '@angular/core';
import {
  MdDialog,
  MdDialogRef,
  MD_DIALOG_DATA,
  MdDatepickerModule,
  MdNativeDateModule,
  DateAdapter,
  NativeDateAdapter,
} from '@angular/material';
import * as moment from 'moment';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';
import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionService } from '../shared/search-condition.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { KeysPipe } from '../../shared/pipes/keys.pipe';

class MyDateAdapter extends NativeDateAdapter {
  getDateNames(): string[] {
    const dateNames: string[] = [];
    for (let i = 0; i < 31; i++) {
      dateNames[i] = String(i + 1);
    }
    return dateNames;
  }
}


@Component({
  selector: 'app-search-condition-dialog',
  templateUrl: './search-condition.dialog.html',
  styleUrls: ['./search-condition.dialog.scss'],
  providers: [ { provide: DateAdapter, useClass: MyDateAdapter }]
})
export class SearchConditionDialogComponent implements OnInit {
  form: SearchConditionModel;
  checklist: Array<any>;
  dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;
  customDateRange: any;

  constructor(
    public dialogRef: MdDialogRef<SearchConditionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public auth: AuthenticationService,
    private userService: UserService,
    private searchConditionService: SearchConditionService,
    dateAdapter: DateAdapter<NativeDateAdapter>) {
      dateAdapter.setLocale('ja');
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

    if (this.isSpecificDateRange(this.form.dateSearchPattern)) {
      if (this.form.dateFrom) {
        this.form.dateFrom = moment(this.form.dateFrom).startOf('date').toString();
      }
      if (this.form.dateTo) {
        this.form.dateTo = moment(this.form.dateTo).endOf('date').toString();
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
