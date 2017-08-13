import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderby'})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, args?) {
    const DESC_OPERATOR = '-';

    if (!array) {
      return array;
    }

    let orderByValue = args[0];
    let byVal = 1; // 昇順
    if (orderByValue.charAt(0) === DESC_OPERATOR) {
      byVal = -1; // 降順
      orderByValue = orderByValue.substring(1);
    }


    array.sort((a: any, b: any) => {
      if (a[orderByValue] < b[orderByValue]) {
        return -1 * byVal;
      } else if (a[orderByValue] > b[orderByValue]) {
        return 1 * byVal;
      } else {
        return 0;
      }
    });

    return array;
  }
}
