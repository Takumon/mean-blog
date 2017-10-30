import { MatPaginatorIntl } from '@angular/material';
export class PaginatorService extends MatPaginatorIntl {
  itemsPerPageLabel = '1ページあたりの件数';
  nextPageLabel     = '次ページ';
  previousPageLabel = '前ページ';
  startIndex: number;
  endIndex: number;

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 / ' + length;
    }
    length = Math.max(length, 0);
    this.startIndex = page * pageSize;
    this.endIndex = this.startIndex < length
      ? Math.min(this.startIndex + pageSize, length)
      : this.startIndex + pageSize;

      return (this.startIndex + 1) + ' - ' + this.endIndex + ' / ' + length;
  }
}
