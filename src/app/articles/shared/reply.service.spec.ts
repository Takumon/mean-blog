import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';


import { ReplyService } from './reply.service';
import { ReplyModel } from './reply.model';
import { ReplyWithUserModel } from './reply-with-user.model';
import { ReplyWithArticleModel } from './reply-with-article.model';



describe('ReplyService', () => {
  let service: ReplyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStorageService,
        ReplyService
      ],
    });

    service = TestBed.get(ReplyService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    httpMock.verify();
  });


  describe('get', () => {
    const mockResponse: Array<ReplyModel> =  [
      {
        _id: '123456789011',
        articleId: '123456789022',
        commentId:  '123456789033',
        text: 'リプライコメント',
        user: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    ];

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_condition = {};
      const arg_withUser = true;
      const arg_withArtilce = true;

      service.get(arg_condition, arg_withUser, arg_withArtilce).subscribe((res: Array<ReplyModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].commentId).toEqual('123456789033');
        expect(res[0].text).toEqual('リプライコメント');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがtrue_withArticleがfalse', () => {

      const arg_condition = {};
      const arg_withUser = true;
      const arg_withArtilce = false;

      service.get(arg_condition, arg_withUser, arg_withArtilce).subscribe((res: Array<ReplyModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].commentId).toEqual('123456789033');
        expect(res[0].text).toEqual('リプライコメント');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_condition = {};
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.get(arg_condition, arg_withUser, arg_withArtilce).subscribe((res: Array<ReplyModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].commentId).toEqual('123456789033');
        expect(res[0].text).toEqual('リプライコメント');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUser指定しない_withArticle指定しない', () => {

      const arg_condition = {};

      service.get(arg_condition).subscribe((res: Array<ReplyModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].commentId).toEqual('123456789033');
        expect(res[0].text).toEqual('リプライコメント');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

  });



  describe('getById', () => {
    const mockResponse: ReplyModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      commentId:  '123456789033',
      text: 'リプライコメント',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;
      const arg_withArtilce = true;

      service.getById(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがtrue_withArticleがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;
      const arg_withArtilce = false;

      service.getById(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.getById(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUser指定しない_withArticle指定しない', () => {

      const arg_id = '123456789011';

      service.getById(arg_id).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });



  describe('register', () => {
    const mockResponse: ReplyModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      commentId:  '123456789033',
      text: 'リプライコメント',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_reply = new ReplyModel();
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';

      const arg_withUser = true;
      const arg_withArtilce = true;

      service.register(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがtrue_withArticleがfalse', () => {

      const arg_reply = new ReplyModel();
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';

      const arg_withUser = true;
      const arg_withArtilce = false;

      service.register(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_reply = new ReplyModel();
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.register(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUser指定しない_withArticle指定しない', () => {

      const arg_reply = new ReplyModel();
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';

      service.register(arg_reply).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });




  describe('update', () => {
    const mockResponse: ReplyModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      commentId:  '123456789033',
      text: 'リプライコメント',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:40:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_reply = new ReplyModel();
      arg_reply._id = '123456789011';
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';
      arg_reply.created = '20150101 12:34:30';
      arg_reply.updated = '20150101 12:34:30';

      const arg_withUser = true;
      const arg_withArtilce = true;

      service.update(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがtrue_withArticleがfalse', () => {

      const arg_reply = new ReplyModel();
      arg_reply._id = '123456789011';
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';
      arg_reply.created = '20150101 12:34:30';
      arg_reply.updated = '20150101 12:34:30';

      const arg_withUser = true;
      const arg_withArtilce = false;

      service.update(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_reply = new ReplyModel();
      arg_reply._id = '123456789011';
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';
      arg_reply.created = '20150101 12:34:30';
      arg_reply.updated = '20150101 12:34:30';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.update(arg_reply, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUser指定しない_withArticle指定しない', () => {

      const arg_reply = new ReplyModel();
      arg_reply._id = '123456789011';
      arg_reply.articleId = '123456789022';
      arg_reply.commentId = '123456789033';
      arg_reply.text = 'リプライコメント';
      arg_reply.user = '123456789044';
      arg_reply.created = '20150101 12:34:30';
      arg_reply.updated = '20150101 12:34:30';

      service.update(arg_reply).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_reply);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('delete', () => {
    const mockResponse: ReplyModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      commentId:  '123456789033',
      text: 'リプライコメント',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;
      const arg_withArtilce = true;

      service.delete(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがtrue_withArticleがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;
      const arg_withArtilce = false;

      service.delete(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.delete(arg_id, arg_withUser, arg_withArtilce).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUser指定しない_withArticle指定しない', () => {

      const arg_id = '123456789011';

      service.delete(arg_id).subscribe((res: ReplyModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.commentId).toEqual('123456789033');
        expect(res.text).toEqual('リプライコメント');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/replies/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });
});

