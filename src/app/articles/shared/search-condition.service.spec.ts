import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchConditionService } from './search-condition.service';
import { SearchConditionModel } from './search-condition.model';


describe('SearchConditionService', () => {
  let service: SearchConditionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SearchConditionService,
      ],
    });

    service = TestBed.get(SearchConditionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    // httpMock.verify();
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

      service.get(arg_condition, arg_withUser).subscribe();

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

      service.get(arg_condition).subscribe();

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

      service.get(arg_condition).subscribe();

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

      service.get(arg_condition).subscribe();

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

      service.get(arg_condition).subscribe();

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"userId":["123456789011","123456789012"]}');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });



  describe('getById', () => {
    const mockResponse: SearchConditionModel =  {
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
    };

    it ('withUserがtrue', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;

      service.getById(arg_id, arg_withUser).subscribe((res: SearchConditionModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.author).toEqual('123456789011');
        expect(res.name).toEqual('テスト用検索条件');
        expect(res.users.length).toEqual(3);
        expect(res.users[0]).toEqual('123456789040');
        expect(res.users[1]).toEqual('123456789041');
        expect(res.users[2]).toEqual('123456789042');
        expect(res.dateFrom).toEqual('20150101 12:34:30');
        expect(res.dateTo).toEqual('20160101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeTruthy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = false;

      service.getById(arg_id, arg_withUser).subscribe();

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserを指定しない', () => {

      const arg_id = '123456789011';

      service.getById(arg_id).subscribe();

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/searchconditions/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });




  it('register', () => {
    const mockResponse =  {
      message: 'お気に入り検索条件を登録しました。',
      obj: {
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
    };

    const arg_model = new SearchConditionModel();
    arg_model.author = '123456789011';
    arg_model.name = 'テスト用検索条件';
    arg_model.users = [
      '123456789040',
      '123456789041',
      '123456789042',
    ];
    arg_model.dateFrom = '20150101 12:34:30';
    arg_model.dateTo = '20160101 12:34:30';


    service.register(arg_model).subscribe(res => {
      expect(res.message).toEqual('お気に入り検索条件を登録しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.author).toEqual('123456789011');
      expect(res.obj.name).toEqual('テスト用検索条件');
      expect(res.obj.users.length).toEqual(3);
      expect(res.obj.users[0]).toEqual('123456789040');
      expect(res.obj.users[1]).toEqual('123456789041');
      expect(res.obj.users[2]).toEqual('123456789042');
      expect(res.obj.dateFrom).toEqual('20150101 12:34:30');
      expect(res.obj.dateTo).toEqual('20160101 12:34:30');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/searchconditions';
    });

    expect(req.request.method).toEqual('POST');
    // レスポンス返却
    req.flush(mockResponse);
  });




  it('update', () => {
    const mockResponse =  {
      message: 'お気に入り検索条件を更新しました。',
      obj: {
        _id: '123456789011',
        author: '123456789011',
        name: 'テスト用検索条件',
        users:  [
          '123456789040',
          '123456789041',
        ],
        dateFrom: '20150101 12:34:30',
        dateTo: '20160101 12:34:30',
      }
    };

    const arg_model = new SearchConditionModel();
    arg_model._id = '123456789011';
    arg_model.users = [
      '123456789040',
      '123456789041',
    ];


    service.update(arg_model).subscribe(res => {
      expect(res.message).toEqual('お気に入り検索条件を更新しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.author).toEqual('123456789011');
      expect(res.obj.name).toEqual('テスト用検索条件');
      expect(res.obj.users.length).toEqual(2);
      expect(res.obj.users[0]).toEqual('123456789040');
      expect(res.obj.users[1]).toEqual('123456789041');
      expect(res.obj.dateFrom).toEqual('20150101 12:34:30');
      expect(res.obj.dateTo).toEqual('20160101 12:34:30');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/searchconditions/123456789011';
    });

    expect(req.request.method).toEqual('PUT');
    // レスポンス返却
    req.flush(mockResponse);
  });




  it('delete', () => {
    const mockResponse =  {
      message: 'お気に入り検索条件を削除しました。',
      obj: {
        _id: '123456789011',
        author: '123456789011',
        name: 'テスト用検索条件',
        users:  [
          '123456789040',
          '123456789041',
        ],
        dateFrom: '20150101 12:34:30',
        dateTo: '20160101 12:34:30',
      }
    };

    const arg_id = '123456789011';

    service.delete(arg_id).subscribe(res => {
      expect(res.message).toEqual('お気に入り検索条件を削除しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.author).toEqual('123456789011');
      expect(res.obj.name).toEqual('テスト用検索条件');
      expect(res.obj.users.length).toEqual(2);
      expect(res.obj.users[0]).toEqual('123456789040');
      expect(res.obj.users[1]).toEqual('123456789041');
      expect(res.obj.dateFrom).toEqual('20150101 12:34:30');
      expect(res.obj.dateTo).toEqual('20160101 12:34:30');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/searchconditions/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');
    // レスポンス返却
    req.flush(mockResponse);
  });
});

