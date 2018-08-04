import { PipeTransform } from '@angular/core';

// @Pipe({ name: 'fromNow'})
export class FromNowPipe implements PipeTransform {
  transform(datetime: string, args?) {

    if (!datetime) {
      return datetime;
    }

    const date = new Date(datetime);
    const diff = new Date().getTime() - date.getTime();
    const d = new Date(diff);

    if (d.getUTCFullYear() - 1970) {
      return d.getUTCFullYear() - 1970 + '年前';
    }
    if (d.getUTCMonth()) {
      return d.getUTCMonth() + 'ヶ月前';
    }
    if (d.getUTCDate() - 1) {
      return d.getUTCDate() - 1 + '日前';
    }
    if (d.getUTCHours()) {
      return d.getUTCHours() + '時間前';
    }
    if (d.getUTCMinutes()) {
      return d.getUTCMinutes() + '分前';
    }
    return d.getUTCSeconds() + '秒前';
  }
}
