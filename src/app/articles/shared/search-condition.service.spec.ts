import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStrageService } from '../../shared/services/local-strage.service';


import { SearchConditionService } from './search-condition.service';
import { SearchConditionModel } from './search-condition.model';



describe('SearchConditionService', () => {
  let service: SearchConditionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStrageService,
        SearchConditionService
      ],
    });

    service = TestBed.get(SearchConditionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    httpMock.verify();
  });


  describe('get', () => {
    const mockResponse: Array<SearchConditionModel> =  [
      {
        _id: '123456789011',
        author: '123456789011',
        name: 'テスト用検索条件',
        users:  [
          '123456789040',
          '123456789041',
          '123456789042',
        ],
        dateFrom: '20150101 12:34:30',
        dateTo: '20160101 12:34:30',
      }
    ];

    it ('withUserがtrue', () => {

      const arg_condition = {};
      const arg_withUser = true;

      service.get(arg_condition, arg_withUser).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeTruthy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse', () => {

      const arg_condition = {};
      const arg_withUser = false;

      service.get(arg_condition, arg_withUser).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserを指定しない', () => {

      const arg_condition = {};

      service.get(arg_condition).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('検索条件が空オブジェクト', () => {

      const arg_condition = {};

      service.get(arg_condition).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');

      // レスポンス返却
      req.flush(mockResponse);
    });




    it ('検索条件にuserIdを文字列で指定', () => {

      const arg_condition = {
        userId: '123456789011'
      };

      service.get(arg_condition).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"userId":"123456789011"}');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('検索条件にuserIdを文字列配列で指定', () => {

      const arg_condition = {
        userId: [
          '123456789011',
          '123456789012'
        ]
      };

      service.get(arg_condition).subscribe((res: Array<SearchConditionModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].author).toEqual('123456789011');
        expect(res[0].name).toEqual('テスト用検索条件');
        expect(res[0].users.length).toEqual(3);
        expect(res[0].users[0]).toEqual('123456789040');
        expect(res[0].users[1]).toEqual('123456789041');
        expect(res[0].users[2]).toEqual('123456789042');
        expect(res[0].dateFrom).toEqual('20150101 12:34:30');
        expect(res[0].dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"userId":["123456789011","123456789012"]}');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });



});

