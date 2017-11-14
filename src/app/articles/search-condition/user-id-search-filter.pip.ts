import { Pipe, PipeTransform } from '@angular/core';
import { UserListFactor } from './search-condition.dialog';

@Pipe({
  name: 'userIdSearchFilter',
  pure: false // リストの中身が変更されたら随時このパイプを実行する
})
export class UserIdSearchFilterPipe implements PipeTransform {
  transform(items: Array<UserListFactor>, searchUserName: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchUserName) {
      return items;
    }
    searchUserName = searchUserName.toLowerCase();
    return items.filter( item => item.user.userId.toLowerCase().includes(searchUserName));
  }
}
