import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
  JwtService,
  LocalStorageService,
} from '../../shared/services';


import { DraftService } from './draft.service';
import { DraftModel } from './draft.model';



describe('DraftService', () => {
  let injector: TestBed;
  let service: DraftService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStorageService,
        DraftService
      ],
    });

    injector = getTestBed();
    service = injector.get(DraftService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    // モック化した API がコールされたか検証する
    httpMock.verify();
  });


  it('get', () => {
    const mockResponse: Array<DraftModel> =  [
      {
        _id: '123456789011',
        title: '下書きタイトル',
        isMarkdown: false,
        body: '下書き本文',
        author: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    ];

    const arg_condition = {};

    service.get(arg_condition).subscribe((res: Array<DraftModel>) => {
      expect(res.length).toEqual(1);
      expect(res[0]._id).toEqual('123456789011');
      expect(res[0].title).toEqual('下書きタイトル');
      expect(res[0].isMarkdown).toEqual(false);
      expect(res[0].body).toEqual('下書き本文');
      expect(res[0].author).toEqual('123456789044');
      expect(res[0].created).toEqual('20150101 12:34:30');
      expect(res[0].updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/drafts';
    });

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('condition')).toEqual('{}');

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('getById', () => {
    const mockResponse: DraftModel =  {
      _id: '123456789011',
      title: '下書きタイトル',
      isMarkdown: false,
      body: '下書き本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };

    const arg_id = '123456789011';

    service.getById(arg_id).subscribe((res: DraftModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.title).toEqual('下書きタイトル');
      expect(res.isMarkdown).toEqual(false);
      expect(res.body).toEqual('下書き本文');
      expect(res.author).toEqual('123456789044');
      expect(res.created).toEqual('20150101 12:34:30');
      expect(res.updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/drafts/123456789011';
    });

    expect(req.request.method).toEqual('GET');

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('register', () => {
    const mockResponse: DraftModel =  {
      _id: '123456789011',
      title: '下書きタイトル',
      isMarkdown: false,
      body: '下書き本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };

    const arg_draft = new DraftModel();
    arg_draft.title = '下書きタイトル';
    arg_draft.isMarkdown = false;
    arg_draft.body = '下書き本文';
    arg_draft.author = '123456789044';

    service.register(arg_draft).subscribe((res: DraftModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.title).toEqual('下書きタイトル');
      expect(res.isMarkdown).toEqual(false);
      expect(res.body).toEqual('下書き本文');
      expect(res.author).toEqual('123456789044');
      expect(res.created).toEqual('20150101 12:34:30');
      expect(res.updated).toEqual('20150101 12:34:30');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/drafts';
    });

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(arg_draft);

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('update', () => {
    const mockResponse: DraftModel =  {
      _id: '123456789011',
      title: '下書きタイトル更新後',
      isMarkdown: false,
      body: '下書き本文更新後',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150102 12:34:30'
    };

    const arg_draft = new DraftModel();
    arg_draft._id = '123456789011';
    arg_draft.title = '下書きタイトル更新後';
    arg_draft.body = '下書き本文更新後';

    service.update(arg_draft).subscribe((res: DraftModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.title).toEqual('下書きタイトル更新後');
      expect(res.isMarkdown).toEqual(false);
      expect(res.body).toEqual('下書き本文更新後');
      expect(res.author).toEqual('123456789044');
      expect(res.created).toEqual('20150101 12:34:30');
      expect(res.updated).toEqual('20150102 12:34:30');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/drafts/123456789011';
    });

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(arg_draft);

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('delete', () => {
    const mockResponse: DraftModel =  {
      _id: '123456789011',
      title: '下書きタイトル',
      isMarkdown: false,
      body: '下書き本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };


    const arg_id = '123456789011';

    service.delete(arg_id).subscribe((res: DraftModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.title).toEqual('下書きタイトル');
      expect(res.isMarkdown).toEqual(false);
      expect(res.body).toEqual('下書き本文');
      expect(res.author).toEqual('123456789044');
      expect(res.created).toEqual('20150101 12:34:30');
      expect(res.updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/drafts/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');

    // レスポンス返却
    req.flush(mockResponse);
  });



  describe('canRegisterDraft', () => {
    it('下書きが存在しない場合', () => {
      const mockResponse: Array<DraftModel> =  null;


      service.canRegisterDraft('123456789012').subscribe((result: boolean) => {
        expect(result).toEqual(true);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/drafts';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789012"}');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it('下書きが0件の場合', () => {
      const mockResponse: Array<DraftModel> =  [
      ];


      service.canRegisterDraft('123456789012').subscribe((result: boolean) => {
        expect(result).toEqual(true);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/drafts';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789012"}');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('下書きが(MAX_DRAFT_COUNT - 1)件の場合', () => {
      const mockResponse: Array<DraftModel> =  [
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
      ];


      service.canRegisterDraft('123456789012').subscribe((result: boolean) => {
        expect(result).toEqual(true);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/drafts';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789012"}');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('下書きが(MAX_DRAFT_COUNT)件の場合', () => {
      const mockResponse: Array<DraftModel> =  [
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
        {
          _id: '123456789011',
          title: '下書きタイトル',
          isMarkdown: false,
          body: '下書き本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        },
      ];


      service.canRegisterDraft('123456789012').subscribe((result: boolean) => {
        expect(result).toEqual(false);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/drafts';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789012"}');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });

});

