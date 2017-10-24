import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'checkedList'})
export class CheckedListPipe implements PipeTransform {
  transform(list: Array<any>, args?) {

    if (!list || list.length === 0) {
      return list;
    }

    return list.filter(factor => {
      return factor.checked;
    });
  }
}
