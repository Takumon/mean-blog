import { TestBed, getTestBed } from '@angular/core/testing';

import { PaginatorService } from './paginator.service';


describe('PaginatorService', () => {
  let injector: TestBed;
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [  ],
      providers: [
        PaginatorService
      ],
    });

    injector = getTestBed();
    service = injector.get(PaginatorService);
  });

  describe('getRangeLabel', () => {

    it('lengthが0', () => {
      const arg_pageIndex = 1;
      const arg_pageSize = 20;
      const arg_length = 0;

      const actual = service.getRangeLabel(arg_pageIndex, arg_pageSize, arg_length);
      expect(actual).toEqual('0 / 0');
    });

    it('pageSizeが0', () => {
      const arg_pageIndex = 1;
      const arg_pageSize = 0;
      const arg_length = 10;

      const actual = service.getRangeLabel(arg_pageIndex, arg_pageSize, arg_length);
      expect(actual).toEqual('0 / 10');
    });

    it('通常', () => {
      const arg_pageIndex = 2;
      const arg_pageSize = 20;
      const arg_length = 60;


      const actual = service.getRangeLabel(arg_pageIndex, arg_pageSize, arg_length);
      expect(actual).toEqual('60 件　　　3 / 3ページ目');
    });
  });

  describe('calcRange', () => {
    it('通常', () => {
      const arg_pageIndex = 2;
      const arg_pageSize = 20;
      const arg_length = 60;


      const actual = service.calcRange(arg_pageIndex, arg_pageSize, arg_length);
      expect(actual.startIndex).toEqual(40);
      expect(actual.endIndex).toEqual(60);
    });

    it('最後のページの件数がpageSize未満の場合', () => {
      const arg_pageIndex = 2;
      const arg_pageSize = 20;
      const arg_length = 50;


      const actual = service.calcRange(arg_pageIndex, arg_pageSize, arg_length);
      expect(actual.startIndex).toEqual(40);
      expect(actual.endIndex).toEqual(50);
    });
  });
});
