import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {
 ErrorStateMatcher
} from '@angular/material';

import { MessageBarService } from './message-bar.service';

@Injectable()
export class MessageService {
  static PATTERN_EMAIL: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  static PATTERN_HANKAKUEISU: RegExp = /^[a-zA-Z\d]*$/;
  static PATTERN_PASSWORD: RegExp = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i;

  static validationMessages = {
    required: '{0}を入力してください',
    minlength: '{0}は{1}桁以上にしてください',
    maxlength: '{0}は{1}桁以下にしてください',
    passwordMatch: 'パスワードと確認用パスワードが一致しません',
    pattern_hankakueisuji: '{0}は半角英数字で入力してください',
    pattern_password: 'パスワードは半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下にしてください',
    pattern_email: 'メール形式で入力してください',
    isDate: '{0}は日付形式で入力してください',
    isExistDateRange: '期間指定の場合は少なくとも{0}か{1}のどちらかを指定してください',
    isCollectedDateRange: '{0}は{1}以前を指定してください',
  };

  static validation = {
    isDate: (control: AbstractControl): ValidationErrors|null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return !isNaN(Date.parse(value))
        ? null
        : {isDate: true};
    },
    isExistDateRange: (group: AbstractControl): ValidationErrors|null => {
      const dateSearchPattern = group.get('dateSearchPattern').value;
      const dateTo = group.get('dateTo').value;
      const dateFrom = group.get('dateFrom').value;

      if (dateSearchPattern !== '6') {
        return null;
      }

      // どちらかの指定が必要
      return !!(dateTo || dateFrom)
        ? null
        : { isExistDateRange: true };
    },
    isCollectedDateRange: (group: AbstractControl): ValidationErrors|null => {
      const dateSearchPattern = group.get('dateSearchPattern').value;
      const controlDateFrom: AbstractControl = group.get('dateFrom');
      const dateFrom = controlDateFrom.value;
      const controlDateTo: AbstractControl = group.get('dateTo');
      const dateTo = controlDateTo.value;

      // TODO 定数化
      if (dateSearchPattern !== '6') {
        return null;
      }

      // 両方存在する場合のみ
      if (!dateFrom || !dateTo) {
        return null;
      }

      // どちらかが日付形式ではない場合は大小比較はできない
      if (MessageService.validation.isDate(controlDateFrom) != null
          || MessageService.validation.isDate(controlDateTo) != null) {
        return null;
      }

      return Date.parse(dateFrom) <= Date.parse(dateTo)
        ? null
        : { isCollectedDateRange: true };
    }

  };


  get(validationName: string, replacements: Array<string> = []): string {
    let messageTemplate = MessageService.validationMessages[validationName];
    messageTemplate = messageTemplate || validationName;

    if (!replacements || replacements.length === 0) {
      return messageTemplate;
    }

    replacements.forEach((replacement, index) => {
      messageTemplate = messageTemplate.replace('{' + index + '}', replacement);
    });

    return messageTemplate;
  }

  hasError(control: FormControl, validationName: string): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  hasErrorWithoutDirty(control: FormControl | FormGroup, validationName: string): Boolean {
    return control.hasError(validationName);
  }
}

@Injectable()
export class ErrorStateMatcherContainParentGroup implements ErrorStateMatcher {
  // 親グループも含めてチェック
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid || control.parent.invalid) && (control.parent.dirty || isSubmitted);
  }
}
