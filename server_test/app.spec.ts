import * as supertest from 'supertest';

import app from '../server/app';
import { Message } from '../server/models/message';


describe('/api/messages', () => {
  const request = supertest(app);
  const endpoint = '/api/messages';

  const messageAscending = (m1, m2) => {
    if (m1.message > m2.message) {
      return 1;
    }

    if (m1.message < m2.message) {
      return -1;
    }

    return 0;
  };

  // テスト前にDBのmessagesを初期化する
  beforeEach(() => {
    Message.remove({}, () => {});
  });


  describe('Get', () => {

    it('レスポンスがjson形式でステータスコードが200か', (done) => {

      request.get(endpoint)
        .expect((res) => {
          expect(res.type).toEqual('application/json');
          expect(res.statusCode).toEqual(200);
        }).end(done);
    });


    it('メッセージ一覧が取得できるか', (done) => {

      const testData = [
        { message: 'テスト用メッセージ１' },
        { message: 'テスト用メッセージ２' },
        { message: 'テスト用メッセージ３' },
      ];

      Message.create(testData, (erro , doc ) => {
        request.get(endpoint)
          .expect((res) => {

            const sortedMessages = res.body.messages.sort(messageAscending);

            expect(sortedMessages.length).toEqual(3);
            expect(sortedMessages[0].message).toEqual('テスト用メッセージ１');
            expect(sortedMessages[1].message).toEqual('テスト用メッセージ２');
            expect(sortedMessages[2].message).toEqual('テスト用メッセージ３');
          })
          .end(done);
      });
    });


    it('異常時にエラーハンドリングされるか', (done) => {

      spyOn(Message, 'find').and.callFake(function(callback) {
        callback(new Error('エラー'), null);
      });

      request.get(endpoint)
        .expect((res) => {

          expect(res.type).toEqual('application/json');
          expect(res.statusCode).toEqual(500);

          expect(res.body.title).toEqual('エラーが発生しました。');
          expect(res.body.error).toEqual('エラー');
        })
        .end(done);
    });

  });



  describe('Post', () => {

    it('レスポンスがjson形式でステータスコードが200か', (done) => {

      request.post(endpoint).send({message: 'テスト用メッセージ１'})
          .expect((res) => {
            expect(res.type).toEqual('application/json');
            expect(res.statusCode).toEqual(200);
          }).end(done);
    });


    it('メッセージが登録できるか', (done) => {

      request.post(endpoint).send({message: 'テスト用メッセージ１'})
        .expect((res) => {

          expect(res.body.message).toEqual('メッセージを登録しました。');
          expect(res.body.obj.message).toEqual('テスト用メッセージ１');
        })
        .end(done);
    });


    it('異常時にエラーハンドリングされるか', (done) => {

      spyOn(Message.prototype, 'save').and.callFake(function(callback) {
        callback(new Error('エラー'), null);
      });

      request.post(endpoint).send({message: 'テスト用メッセージ１'})
        .expect((res) => {

          expect(res.type).toEqual('application/json');
          expect(res.statusCode).toEqual(500);
          expect(res.body.title).toEqual('エラーが発生しました。');
          expect(res.body.error).toEqual('エラー');
        })
        .end(done);
    });

  });

});
