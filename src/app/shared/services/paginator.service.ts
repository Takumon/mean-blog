import { MatPaginatorIntl } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


export class PaginatorService extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel     = '次ページ';
  previousPageLabel = '前ページ';

  getRangeLabel = (pageIndex, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 / ' + length;
    }

    const range = this.calcRange(pageIndex, pageSize, length);
    return length + ' 件　　　' + (pageIndex + 1) + '/' + Math.ceil(length / pageSize) + 'ページ目';
  }

  calcRange(pageIndex, pageSize, length): {startIndex: number, endIndex: number} {
    length = Math.max(length, 0);
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

    return {
      startIndex,
      endIndex,
    };
  }
}
