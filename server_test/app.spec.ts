import * as supertest from 'supertest';
import * as moment from 'moment';

import app from '../server/app';
import { Article } from '../server/models/article';


describe('/api/articles', () => {
  const request = supertest(app);
  const endpoint = '/api/articles';

  const ascending = (propName) => {
    return (a , b) => {
      if (a[propName] > b[propName]) {
        return 1;
      }

      if (a[propName] < b[propName]) {
        return -1;
      }

      return 0;
    };
  };

  // テスト前にDBのmessagesを初期化する
  beforeEach(() => {
    Article.remove({}, () => {});
  });


  describe('Get', () => {

    it('レスポンスがjson形式でステータスコードが200か', (done) => {

      request.get(endpoint)
        .expect((res) => {
          expect(res.type).toEqual('application/json');
          expect(res.statusCode).toEqual(200);
        }).end(done);
    });


    it('記事覧が取得できるか', (done) => {

      const testData = [
        {
          title: 'テスト用タイトル1',
          body: 'テスト用ボティ1',
          date:  moment('20150101 12:30:30', 'YYYYMMDD hh:mm:ss').toDate()
        },
        {
          title: 'テスト用タイトル2',
          body: 'テスト用ボティ2',
          date:  moment('20150101 12:34:30', 'YYYYMMDD hh:mm:ss').toDate()
        },
        {
          title: 'テスト用タイトル3',
          body: 'テスト用ボティ3',
          date:  moment('20150101 12:31:30', 'YYYYMMDD hh:mm:ss').toDate()
        }
      ];

      Article.create(testData, (erro , doc ) => {
        request.get(endpoint)
          .expect((res) => {
            const sorted = res.body.articles.sort(ascending('date'));

            expect(sorted.length).toEqual(3);
            expect(sorted[0].title).toEqual('テスト用タイトル1');
            expect(sorted[1].title).toEqual('テスト用タイトル3');
            expect(sorted[2].title).toEqual('テスト用タイトル2');
          })
          .end(done);
      });
    });


    it('異常時にエラーハンドリングされるか', (done) => {

      spyOn(Article, 'find').and.callFake(function(callback) {
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

      request.post(endpoint).send({
          title: 'テスト用タイトル1',
          body: 'テスト用ボティ1',
          date:  moment('20150101 12:30:30', 'YYYYMMDD hh:mm:ss').toDate()
      })
      .expect((res) => {
        expect(res.type).toEqual('application/json');
        expect(res.statusCode).toEqual(200);
      }).end(done);
    });


    it('メッセージが登録できるか', (done) => {

      request.post(endpoint).send({
          title: 'テスト用タイトル1',
          body: 'テスト用ボティ1',
          date:  moment('20150101 12:30:30', 'YYYYMMDD hh:mm:ss').toDate()
      })
      .expect((res) => {

        expect(res.body.message).toEqual('記事を登録しました。');
        expect(res.body.obj.title).toEqual('テスト用タイトル1');
      })
      .end(done);
    });


    it('異常時にエラーハンドリングされるか', (done) => {

      spyOn(Article.prototype, 'save').and.callFake(function(callback) {
        callback(new Error('エラー'), null);
      });

      request.post(endpoint).send({
          title: 'テスト用タイトル1',
          body: 'テスト用ボティ1',
          date:  moment('20150101 12:30:30', 'YYYYMMDD hh:mm:ss').toDate()
      })
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
