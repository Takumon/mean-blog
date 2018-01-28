import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ArticleService } from './article.service';
import { ArticleModel } from './article.model';
import { ArticleComponent } from '../article-list/article.component';
import { UserModel } from '../../users/shared/user.model';


describe('ArticleService', () => {
  let injector: TestBed;
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
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


  it('register', () => {
    const mockResponse = {
      message: '記事を登録しました。',
      obj: {
        _id: '123456789011',
        title: '記事タイトル',
        isMarkdown: false,
        body: '記事本文',
        author: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    };


    const arg_id = '123456789011';

    const arg_model = new ArticleModel();
    arg_model.title = '記事タイトル';
    arg_model.isMarkdown = false;
    arg_model.body = '記事本文';
    arg_model.author = '123456789044';


    service.register(arg_model).subscribe(res => {
      expect(res.message).toEqual('記事を登録しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.title).toEqual('記事タイトル');
      expect(res.obj.isMarkdown).toEqual(false);
      expect(res.obj.body).toEqual('記事本文');
      expect(res.obj.author).toEqual('123456789044');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles';
    });

    expect(req.request.method).toEqual('POST');

    // レスポンス返却
    req.flush(mockResponse);
  });



  it('update', () => {
    const mockResponse = {
      message: '記事を更新しました。',
      obj: {
        _id: '123456789011',
        title: '記事タイトル',
        isMarkdown: false,
        body: '記事本文',
        author: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:40:30'
      }
    };


    const arg_id = '123456789011';

    const arg_model = new ArticleModel();
    arg_model._id = '123456789011';
    arg_model.title = '記事タイトル';
    arg_model.isMarkdown = false;
    arg_model.body = '記事本文';
    arg_model.author = '123456789044';
    arg_model.created = '20150101 12:34:30';
    arg_model.updated = '20150101 12:34:30';



    service.update(arg_model).subscribe(res => {
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.title).toEqual('記事タイトル');
      expect(res.obj.isMarkdown).toEqual(false);
      expect(res.obj.body).toEqual('記事本文');
      expect(res.obj.author).toEqual('123456789044');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:40:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789011';
    });

    expect(req.request.method).toEqual('PUT');

    // レスポンス返却
    req.flush(mockResponse);
  });





  it('delete', () => {
    const mockResponse = {
      message: '記事を削除しました',
      obj: {
        _id: '123456789011',
        title: '記事タイトル',
        isMarkdown: false,
        body: '記事本文',
        author: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:40:30'
      }
    };

    const arg_id = '123456789011';

    service.delete(arg_id).subscribe(res => {
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.title).toEqual('記事タイトル');
      expect(res.obj.isMarkdown).toEqual(false);
      expect(res.obj.body).toEqual('記事本文');
      expect(res.obj.author).toEqual('123456789044');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:40:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');

    // レスポンス返却
    req.flush(mockResponse);
  });



  describe('getVote', () => {
    const mockUserModelsResponse: UserModel[] = [
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

    const mockUserIdsResponse: string[] = [
      '123456789011'
    ];

    it('withUserがtrue', () => {
      const arg_idOfArticle = '123456789099';
      const arg_withUser = true;

      service.getVote(arg_idOfArticle, arg_withUser).subscribe((voters: UserModel[]) => {
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
      expect(req.request.params.get('withUser')).toEqual('true');

      // レスポンス返却
      req.flush(mockUserModelsResponse);
    });

    it('withUserがfalse', () => {
      const arg_idOfArticle = '123456789099';
      const arg_withUser = false;

      service.getVote(arg_idOfArticle, arg_withUser).subscribe((voters: string[]) => {
        expect(voters[0]).toEqual('123456789011');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789099/vote';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockUserIdsResponse);
    });

    it('withUserを指定しない', () => {
      const arg_idOfArticle = '123456789099';

      service.getVote(arg_idOfArticle).subscribe((voters: string[]) => {
        expect(voters[0]).toEqual('123456789011');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/articles/123456789099/vote';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();

      // レスポンス返却
      req.flush(mockUserIdsResponse);
    });

  });



  it('registerVote', () => {
    const mockResponse: any = {
      message: '記事にいいねしました。',
      obj: [
        '123456789011',
        '123456789012'
      ]
    };


    const arg_idOfArticle = '123456789099';
    const arg__idOfUser = '123456789011';


    service.registerVote(arg_idOfArticle, arg__idOfUser).subscribe(res => {
      expect(res.message).toEqual('記事にいいねしました。');
      expect(res.obj.length).toEqual(2);
      expect(res.obj[0]).toEqual('123456789011');
      expect(res.obj[1]).toEqual('123456789012');
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
      obj: [
        '123456789012'
      ]
    };

    const arg_idOfArticle = '123456789099';
    const arg__idOfUser = '123456789011';

    service.deleteVote(arg_idOfArticle, arg__idOfUser).subscribe(res => {
      expect(res.message).toEqual('いいねを取り消しました。');
      expect(res.obj.length).toEqual(1);
      expect(res.obj[0]).toEqual('123456789012');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/articles/123456789099/vote/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');

    // レスポンス返却
    req.flush(mockResponse);
  });

});
