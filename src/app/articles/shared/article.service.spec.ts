import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStrageService } from '../../shared/services/local-strage.service';

import { ArticleService } from './article.service';
import { ArticleModel } from './article.model';
import { ArticleComponent } from '../article-list/article.component';
import { UserModel } from '../../users/shared/user.model';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser/src/dom/events/hammer_gestures';


describe('ArticleService', () => {
  let injector: TestBed;
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStrageService,
        ArticleService
      ],
    });

    injector = getTestBed();
    service = injector.get(ArticleService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('get', () => {
    const mockResponse: {count: number, articles: Array<ArticleModel>} = {
      count: 1,
      articles: [
        {
          _id: '123456789011',
          title: '記事タイトル',
          isMarkdown: false,
          body: '記事本文',
          author: '123456789044',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        }
      ]
    };

    it ('withUserがtrue', () => {

      const arg_condition = {author: '123456789044'};
      const arg_pageCondition = {skip: 0, limit: 10};
      const arg_withUser = true;

      service.get(arg_condition, arg_pageCondition, arg_withUser).subscribe(({count, articles}) => {
        expect(count).toEqual(1);
        expect(articles[0]._id).toEqual('123456789011');
        expect(articles[0].title).toEqual('記事タイトル');
        expect(articles[0].isMarkdown).toEqual(false);
        expect(articles[0].body).toEqual('記事本文');
        expect(articles[0].author).toEqual('123456789044');
        expect(articles[0].created).toEqual('20150101 12:34:30');
        expect(articles[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789044","skip":0,"limit":10}');
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse', () => {

      const arg_condition = {author: '123456789044'};
      const arg_pageCondition = {skip: 0, limit: 10};
      const arg_withUser = false;

      service.get(arg_condition, arg_pageCondition, arg_withUser).subscribe(({count, articles}) => {
        expect(count).toEqual(1);
        expect(articles[0]._id).toEqual('123456789011');
        expect(articles[0].title).toEqual('記事タイトル');
        expect(articles[0].isMarkdown).toEqual(false);
        expect(articles[0].body).toEqual('記事本文');
        expect(articles[0].author).toEqual('123456789044');
        expect(articles[0].created).toEqual('20150101 12:34:30');
        expect(articles[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789044","skip":0,"limit":10}');
      expect(req.request.params.has('withUser')).toBeFalsy('false');

      // レスポンス返却
      req.flush(mockResponse);
    });



    it ('withUserを指定しない', () => {

      const arg_condition = {author: '123456789044'};
      const arg_pageCondition = {skip: 0, limit: 10};

      service.get(arg_condition, arg_pageCondition).subscribe(({count, articles}) => {
        expect(count).toEqual(1);
        expect(articles[0]._id).toEqual('123456789011');
        expect(articles[0].title).toEqual('記事タイトル');
        expect(articles[0].isMarkdown).toEqual(false);
        expect(articles[0].body).toEqual('記事本文');
        expect(articles[0].author).toEqual('123456789044');
        expect(articles[0].created).toEqual('20150101 12:34:30');
        expect(articles[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"author":"123456789044","skip":0,"limit":10}');
      expect(req.request.params.has('withUser')).toBeFalsy('false');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });



  describe('getById', () => {
    const mockResponse: ArticleModel = {
      _id: '123456789011',
      title: '記事タイトル',
      isMarkdown: false,
      body: '記事本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };

    it('withUserがtrue', () => {
      const arg_id = '123456789011';
      const arg_withUser = true;

      service.getById(arg_id, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it('withUserがfalse', () => {
      const arg_id = '123456789011';
      const arg_withUser = false;

      service.getById(arg_id, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it('withUserを指定しない', () => {
      const arg_id = '123456789011';

      service.getById(arg_id).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('register', () => {
    const mockResponse: ArticleModel = {
      _id: '123456789011',
      title: '記事タイトル',
      isMarkdown: false,
      body: '記事本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };


    it('withUserがtrue', () => {
      const arg_id = '123456789011';
      const arg_withUser = true;

      const arg_model = new ArticleModel();
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';


      service.register(arg_model, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });



    it('withUserがfalse', () => {
      const arg_id = '123456789011';
      const arg_withUser = false;

      const arg_model = new ArticleModel();
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';


      service.register(arg_model, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('withUserを指定しない', () => {
      const arg_id = '123456789011';

      const arg_model = new ArticleModel();
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';


      service.register(arg_model).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });





  describe('update', () => {
    const mockResponse: ArticleModel = {
      _id: '123456789011',
      title: '記事タイトル',
      isMarkdown: false,
      body: '記事本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:40:30'
    };


    it('withUserがtrue', () => {
      const arg_id = '123456789011';
      const arg_withUser = true;

      const arg_model = new ArticleModel();
      arg_model._id = '123456789011';
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';
      arg_model.created = '20150101 12:34:30';
      arg_model.updated = '20150101 12:34:30';



      service.update(arg_model, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });



    it('withUserがfalse', () => {
      const arg_id = '123456789011';
      const arg_withUser = false;

      const arg_model = new ArticleModel();
      arg_model._id = '123456789011';
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';
      arg_model.created = '20150101 12:34:30';
      arg_model.updated = '20150101 12:34:30';


      service.update(arg_model, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('withUserを指定しない', () => {
      const arg_id = '123456789011';

      const arg_model = new ArticleModel();
      arg_model._id = '123456789011';
      arg_model.title = '記事タイトル';
      arg_model.isMarkdown = false;
      arg_model.body = '記事本文';
      arg_model.author = '123456789044';
      arg_model.created = '20150101 12:34:30';
      arg_model.updated = '20150101 12:34:30';


      service.update(arg_model).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });





  describe('delete', () => {
    const mockResponse: ArticleModel = {
      _id: '123456789011',
      title: '記事タイトル',
      isMarkdown: false,
      body: '記事本文',
      author: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:40:30'
    };


    it('withUserがtrue', () => {
      const arg_id = '123456789011';
      const arg_withUser = true;

      service.delete(arg_id, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });



    it('withUserがfalse', () => {
      const arg_id = '123456789011';
      const arg_withUser = false;

      service.delete(arg_id, arg_withUser).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('withUserを指定しない', () => {
      const arg_id = '123456789011';

      service.delete(arg_id).subscribe(model => {
        expect(model._id).toEqual('123456789011');
        expect(model.title).toEqual('記事タイトル');
        expect(model.isMarkdown).toEqual(false);
        expect(model.body).toEqual('記事本文');
        expect(model.author).toEqual('123456789044');
        expect(model.created).toEqual('20150101 12:34:30');
        expect(model.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });




  it('getVote', () => {
    const mockResponse: Array<UserModel> = [
      {
        _id: '123456789011',
        userId: 'TestUserId',
        email: 'testUser@hoge.com',
        userName: 'テストユーザ',
        isAdmin: false,
        blogTitle: 'テストユーザのブログ',
        userDescription: 'テストユーザです。よろしくお願いします。',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    ];


    const arg_idOfArticle = '123456789099';

    service.getVote(arg_idOfArticle).subscribe(voters => {
      expect(voters[0]._id).toEqual('123456789011');
      expect(voters[0].userId).toEqual('TestUserId');
      expect(voters[0].email).toEqual('testUser@hoge.com');
      expect(voters[0].userName).toEqual('テストユーザ');
      expect(voters[0].isAdmin).toEqual(false);
      expect(voters[0].blogTitle).toEqual('テストユーザのブログ');
      expect(voters[0].userDescription).toEqual('テストユーザです。よろしくお願いします。');
      expect(voters[0].created).toEqual('20150101 12:34:30');
      expect(voters[0].updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789099/vote';
    });

    expect(req.request.method).toEqual('GET');

    // レスポンス返却
    req.flush(mockResponse);
  });




  it('registerVote', () => {
    const mockResponse: any = {
      message: '記事にいいねしました。',
      obj: [
        {
          _id: '123456789011',
          userId: 'TestUserId',
          email: 'testUser@hoge.com',
          userName: 'テストユーザ',
          isAdmin: false,
          blogTitle: 'テストユーザのブログ',
          userDescription: 'テストユーザです。よろしくお願いします。',
          created: '20150101 12:34:30',
          updated: '20150101 12:34:30'
        }
      ]
    };


    const arg_idOfArticle = '123456789099';
    const arg__idOfUser = '123456789011';


    service.registerVote(arg_idOfArticle, arg__idOfUser).subscribe(result => {
      expect(result.message).toEqual('記事にいいねしました。');
      expect(result.obj[0]._id).toEqual('123456789011');
      expect(result.obj[0].userId).toEqual('TestUserId');
      expect(result.obj[0].email).toEqual('testUser@hoge.com');
      expect(result.obj[0].userName).toEqual('テストユーザ');
      expect(result.obj[0].isAdmin).toEqual(false);
      expect(result.obj[0].blogTitle).toEqual('テストユーザのブログ');
      expect(result.obj[0].userDescription).toEqual('テストユーザです。よろしくお願いします。');
      expect(result.obj[0].created).toEqual('20150101 12:34:30');
      expect(result.obj[0].updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789099/vote';
    });

    expect(req.request.method).toEqual('POST');

    // レスポンス返却
    req.flush(mockResponse);
  });




  it('deleteVote', () => {
    const mockResponse: any = {
      message: 'いいねを取り消しました。',
      obj: []
    };

    const arg_idOfArticle = '123456789099';
    const arg__idOfUser = '123456789011';

    service.deleteVote(arg_idOfArticle, arg__idOfUser).subscribe(result => {
      expect(result.message).toEqual('いいねを取り消しました。');
      expect(result.obj.length).toEqual(0);
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789099/vote/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');

    // レスポンス返却
    req.flush(mockResponse);
  });



});
