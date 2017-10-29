import { Component, Inject, OnInit} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormGroupDirective,
  FormControl,
  FormArray,
  NgForm,
  Validators,
  FormBuilder,
  ValidatorFn,
} from '@angular/forms';
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

import { MessageService, ErrorStateMatcherContainParentGroup } from '../../shared/services/message.service';
import { MessageBarService } from '../../shared/services/message-bar.service';

import { UserModel } from '../../users/shared/user.model';
import { UserService } from '../../users/shared/user.service';

import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionService } from '../shared/search-condition.service';

interface UserListFactor {
  _id: string;
  user: {
    _id: string;
    userId: string;
    icon: string;
  };
}

@Component({
  selector: 'app-search-condition-dialog',
  templateUrl: './search-condition.dialog.html',
  styleUrls: ['./search-condition.dialog.scss'],
})
export class SearchConditionDialogComponent implements OnInit {
  // formグループ化したい
  public form: FormGroup;
  private searchConditionId: string;
  public checkUserList: Array<UserListFactor>;
  public unCheckUserList: Array<UserListFactor>;
  public dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  constructor(
    public dialogRef: MatDialogRef<SearchConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public auth: AuthenticationService,
    public messageService: MessageService,
    private messageBarService: MessageBarService,
    public errorStateMatcherContainParentGroup: ErrorStateMatcherContainParentGroup,
    private userService: UserService,
    private searchConditionService: SearchConditionService,
    private dateAdapter: DateAdapter<NativeDateAdapter>) {
      dateAdapter.setLocale('ja');
  }

  ngOnInit() {
    this.cerateForm();
    this.setForm();
  }

  cerateForm() {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(30),
      ]],
      users: this.fb.array([]),
      dateSearchPatternGroup: new FormGroup(
        {
          dateSearchPattern: this.fb.control('', [
          Validators.pattern(/[123456]+/)
          ]),
          dateTo: this.fb.control('', [
            MessageService.validation.isDate
          ]),
          dateFrom: this.fb.control('', [
            MessageService.validation.isDate
          ])
        },
        Validators.compose([
          MessageService.validation.isExistDateRange,
          MessageService.validation.isCollectedDateRange,
        ])
      )
    });
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get users(): FormArray { return this.form.get('users') as FormArray; }
  get dateSearchPatternGroup(): FormGroup { return this.form.get('dateSearchPatternGroup') as FormGroup; }
    get dateSearchPattern(): FormControl { return this.dateSearchPatternGroup.get('dateSearchPattern') as FormControl; }
    get dateFrom(): FormControl { return this.dateSearchPatternGroup.get('dateFrom') as FormControl; }
    get dateTo(): FormControl { return this.dateSearchPatternGroup.get('dateTo') as FormControl; }


  setForm() {

    // TODO ページング
    if (this.data.idForUpdate) {
      // 更新時
      const withUser = false;

      this.searchConditionService
        .getById(this.data.idForUpdate, withUser)
        .subscribe(condition => {
          this.form.patchValue({
            _id: condition._id,
            name: condition.name,
            dateSearchPatternGroup: {
              dateSearchPattern: condition.dateSearchPattern,
              dateFrom: condition.dateFrom && new Date(condition.dateFrom),
              dateTo: condition.dateTo && new Date(condition.dateTo),
            },
            users: condition.users || []
          });

          const checkedUsers: Array<string> = condition.users || [];

          this.userService.getAll()
            .subscribe(users => {
              this.checkUserList = [];
              this.unCheckUserList = [];

              users.forEach(user => {
                const _id = user._id.toString();

                if (checkedUsers.indexOf(_id) === -1) {
                  this.unCheckUserList.push({
                    _id: _id,
                    user: {
                      _id: user._id,
                      userId: user.userId,
                      icon: user.icon
                    }
                  });
                } else {
                  this.checkUserList.push({
                    _id: _id,
                    user: {
                      _id: user._id,
                      userId: user.userId,
                      icon: user.icon
                    }
                  });
                }
              });

              this.checkUserList.forEach(u => this.users.push(new FormControl(u._id)));
            });
        });
    } else {
      // 新規登録時
      this.userService.getAll()
        .subscribe(users => {
          this.checkUserList = [];
          this.unCheckUserList = users.map(user => {
            return {
              _id: user._id,
              user: {
                _id: user._id,
                userId: user.userId,
                icon: user.icon
              }
            };
          });
        });
    }
  }

  trackByUserList(index: UserListFactor, item) {
    return item._id;
  }

  moveToUnCheckList(checkInfo: UserListFactor): void {
    const list = this.checkUserList;
    const index = list.indexOf(checkInfo);
    if (index !== -1) {
      list.splice(index, 1);

      this.unCheckUserList.push(checkInfo);
    }

    const controls = this.users.controls;
    const len = controls.length;
    for (let i = 0; i < len; i++ ) {
      if (controls[i].value === checkInfo._id) {
        this.users.removeAt(i);
        break;
      }
    }
  }

  moveToCheckList(checkInfo: UserListFactor): void {
    const list = this.unCheckUserList;
    const index = list.indexOf(checkInfo);
    if (index !== -1) {
      list.splice(index, 1);

      this.checkUserList.push(checkInfo);
    }

    this.users.push(new FormControl(checkInfo._id));
  }

  upsert() {
    const searchCondition: any = {};
    searchCondition.name = this.form.value.name;
    searchCondition.author = this.auth.loginUser._id;
    searchCondition.users = this.form.value.users;
    searchCondition.dateSearchPattern = this.form.value.dateSearchPatternGroup.dateSearchPattern;
    searchCondition.dateFrom = this.form.value.dateSearchPatternGroup.dateFrom;
    searchCondition.dateTo = this.form.value.dateSearchPatternGroup.dateTo;


    if (this.data.idForUpdate) {
      searchCondition._id = this.data.idForUpdate;
    }

    if (searchCondition.dateFrom) {
      searchCondition.dateFrom = moment(searchCondition.dateFrom).startOf('date').toString();
    }
    if (searchCondition.dateTo) {
      searchCondition.dateTo = moment(searchCondition.dateTo).endOf('date').toString();
    }

    if (searchCondition._id) {
      this.searchConditionService
      .update(searchCondition)
      .subscribe(
        res => this.dialogRef.close(res.obj),
        this.onValidationError.bind(this));
    } else {
      this.searchConditionService
      .create(searchCondition)
      .subscribe(
        res => this.dialogRef.close(res.obj),
        this.onValidationError.bind(this));
    }
  }

  // TODO 共通化できるか検討
  private onValidationError(error: any): void {
    const noControlErrors = [];

    for (const e of error['errors']) {
      // getterからformControllを取得
      const param =  ['dateSearchPattern', 'dateTo', 'dateFrom'].indexOf(e.param) === -1
        ? e.param
        : 'dateSearchPatternGroup';

      const control: FormControl | FormGroup = this[param];
      if (!control) {
        // 該当するfromがないものはスナックバーで表示
        noControlErrors.push(e);
        continue;
      }

      const messages = control.getError('remote');
      if (messages) {
        messages.push(e.msg);
      } else {
        control.setErrors({remote: [e.msg]});
      }
    }

    if (noControlErrors.length > 0) {
      this.messageBarService.showValidationError({errors: noControlErrors});
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  resetDateSearchPattern() {
    this.form.patchValue({
      dateSearchPatternGroup: {
        dateSearchPattern: null,
        dateFrom: null,
        dateTo: null,
      }
    });
    this.dateSearchPatternGroup.markAsDirty();
  }

  isSpecificDateRange(value: string) {
    return DATE_RANGE_PATTERN.期間指定 === Number(value);
  }
}
