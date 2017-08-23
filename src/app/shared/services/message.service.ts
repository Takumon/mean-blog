import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  validationMessages = {
    required: '{0}を入力してください',
    minlength: '{0}は{1}桁以上入力してください',
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
