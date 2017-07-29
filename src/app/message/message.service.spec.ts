import { TestBed, async, inject } from '@angular/core/testing';
import {HttpModule, BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { RequestMethod } from '@angular/http';

import { MessageService } from './message.service';


describe('MessageService', () => {
  class MockError extends Response implements Error {
    name: any;
    message: any;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [MessageService, {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }, MockBackend, BaseRequestOptions]
    });
  });

  it('オブジェクトが生成されるか', async(inject([MockBackend, MessageService], (backend: MockBackend , service: MessageService) => {
    expect(service).toBeTruthy();
  })));


  describe('getAll', () => {

    it('メッセージが取得できるか', async(inject([MockBackend, MessageService], (backend: MockBackend , service: MessageService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body =  { messages : [
          { message : 'テスト用メッセージ1' },
          { message : 'テスト用メッセージ2' },
          { message : 'テスト用メッセージ3' }
        ]};

        const ops = new ResponseOptions({
          status: 200,
          body: JSON.stringify(body)
        });

        conn.mockRespond(new Response(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/messages');
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      service.getAll().subscribe((res) => {
        expect(res.messages.length).toEqual(3);
        expect(res.messages).toEqual([
          { message : 'テスト用メッセージ1' },
          { message : 'テスト用メッセージ2' },
          { message : 'テスト用メッセージ3' }
        ]);
      });
    })));


    it('異常時にエラーハンドリングされるか', async(inject([MockBackend, MessageService], (backend: MockBackend , service: MessageService) => {
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
        expect(conn.request.url).toEqual('/api/messages');
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

    it('登録したメッセージが取得できるか', async(inject([MockBackend, MessageService], (backend: MockBackend , service: MessageService) => {
      backend.connections.subscribe((conn: MockConnection) => {
        const body = {message : 'テスト用メッセージ1'};

        const ops = new ResponseOptions({
          status: 200,
          body: JSON.stringify(body)
        });

        conn.mockRespond(new Response(ops));
      });

      backend.connections.subscribe((conn: MockConnection) => {
        expect(conn.request.url).toEqual('/api/messages');
        expect(conn.request.method).toEqual(RequestMethod.Post);
      });

      service.register('テスト用メッセージ2').subscribe((res) => {
        expect(res).toEqual({message : 'テスト用メッセージ1'});
      });
    })));


    it('異常時にエラーハンドリングされるか', async(inject([MockBackend, MessageService], (backend: MockBackend , service: MessageService) => {
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
        expect(conn.request.url).toEqual('/api/messages');
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
