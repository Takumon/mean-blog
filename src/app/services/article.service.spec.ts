import { TestBed, async, inject } from '@angular/core/testing';
import {HttpModule, BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { RequestMethod } from '@angular/http';

import { ArticleService } from './article.service';


describe('ArticleService', () => {
  class MockError extends Response implements Error {
    name: any;
    message: any;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ArticleService, {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }, MockBackend, BaseRequestOptions]
    });
  });

  it('オブジェクトが生成されるか', async(inject([MockBackend, ArticleService], (backend: MockBackend , service: ArticleService) => {
    expect(service).toBeTruthy();
  })));


  describe('getAll', () => {

    it('記事が取得できるか', async(inject([MockBackend, ArticleService], (backend: MockBackend , service: ArticleService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body =  { articles : [
          {
            title: 'テスト用タイトル1',
            body: 'テスト用ボティ1',
            date:  '20150101 12:30:30'
          },
          {
            title: 'テスト用タイトル2',
            body: 'テスト用ボティ2',
            date:  '20150101 12:34:30'
          },
          {
            title: 'テスト用タイトル3',
            body: 'テスト用ボティ3',
            date:  '20150101 12:31:30'
          }
        ]};

        const ops = new ResponseOptions({
          status: 200,
          body: JSON.stringify(body)
        });

        conn.mockRespond(new Response(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/articles');
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      service.getAll().subscribe((res) => {
        expect(res.articles.length).toEqual(3);
        expect(res.articles).toEqual([
          {
            title: 'テスト用タイトル1',
            body: 'テスト用ボティ1',
            date:  '20150101 12:30:30'
          },
          {
            title: 'テスト用タイトル2',
            body: 'テスト用ボティ2',
            date:  '20150101 12:34:30'
          },
          {
            title: 'テスト用タイトル3',
            body: 'テスト用ボティ3',
            date:  '20150101 12:31:30'
          }
        ]);
      });
    })));


    it('異常時にエラーハンドリングされるか', async(inject([MockBackend, ArticleService], (backend: MockBackend , service: ArticleService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body =  {
          title : 'エラーが発生しました。',
          error: 'エラー'
        };

        const ops = new ResponseOptions({
          status: 500,
          body: JSON.stringify(body)
        });

        conn.mockError(new MockError(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/articles');
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      service.getAll().subscribe(() => {
        fail('エラーハンドリングされなかった。');
      }, res => {
        expect(res).toEqual({
          title : 'エラーが発生しました。',
          error: 'エラー'
        });
      });
    })));

  });

  describe('register', () => {

    it('登録したメッセージが取得できるか', async(inject([MockBackend, ArticleService], (backend: MockBackend , service: ArticleService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body = {
          message : '記事を登録しました。',
          obj: {
            title: 'テスト用タイトル1',
            body: 'テスト用ボティ1',
            date:  '20150101 12:30:30'
          }
        };

        const ops = new ResponseOptions({
          status: 200,
          body: JSON.stringify(body)
        });

        conn.mockRespond(new Response(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/articles');
        expect(conn.request.method).toEqual(RequestMethod.Post);
      });

      service.register('テスト用タイトル1', 'テスト用ボティ2').subscribe((res) => {
        expect(res.message).toEqual('記事を登録しました。');
        expect(res.obj).toEqual({
          title: 'テスト用タイトル1',
          body: 'テスト用ボティ1',
          date:  '20150101 12:30:30'
        });
      });
    })));


    it('異常時にエラーハンドリングされるか', async(inject([MockBackend, ArticleService], (backend: MockBackend , service: ArticleService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body =  {
          title : 'エラーが発生しました。',
          error: 'エラー'
        };

        const ops = new ResponseOptions({
          status: 500,
          body: JSON.stringify(body)
        });

        conn.mockError(new MockError(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/articles');
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      service.getAll().subscribe(() => {
        fail('エラーハンドリングされなかったのでテスト失敗。');
      }, res => {
        expect(res).toEqual({
          title : 'エラーが発生しました。',
          error: 'エラー'
        });
      });
    })));

  });

});
