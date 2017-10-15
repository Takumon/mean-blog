import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  static PATTERN_HANKAKUEISU: RegExp = /^[a-zA-Z\d]*$/;
  static PATTERN_PASSWORD: RegExp = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i;

  validationMessages = {
    required: '{0}を入力してください',
    minlength: '{0}は{1}桁以上にしてください',
    maxlength: '{0}は{1}桁以下にしてください',
    passwordMatch: 'パスワードと確認用パスワードが一致しません',
    pattern_hankakueisuji: '{0}は半角英数字で入力してください',
    pattern_password: 'パスワードは半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下にしてください',
  };

  get(validationName: string, replacements: Array<string> = []): string {
    let messageTemplate = this.validationMessages[validationName];
    messageTemplate = messageTemplate || validationName;

    if (!replacements || replacements.length === 0) {
      return messageTemplate;
    }

    replacements.forEach((replacement, index) => {
      messageTemplate = messageTemplate.replace('{' + index + '}', replacement);
    });

    return messageTemplate;
  }
}
