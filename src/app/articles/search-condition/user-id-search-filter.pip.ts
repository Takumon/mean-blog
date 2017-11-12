import { Pipe, PipeTransform } from '@angular/core';
import { UserListFactor } from './search-condition.dialog';

@Pipe({
  name: 'userIdSearchFilter',
  pure: false
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
