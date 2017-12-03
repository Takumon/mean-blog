import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStrageService } from '../../shared/services/local-strage.service';


import { CommentService } from './comment.service';
import { CommentModel } from './comment.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentWithArticleModel } from './comment-with-article.model';



describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStrageService,
        CommentService
      ],
    });

    service = TestBed.get(CommentService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    httpMock.verify();
  });


  describe('get', () => {
    const mockResponse: Array<CommentModel> =  [
      {
        _id: '123456789011',
        articleId: '123456789022',
        text: 'コメント本文',
        user: '123456789044',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30',
      }
    ];

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_condition = {};
      const arg_withUser = true;
      const arg_withArtilce = true;

      service.get(arg_condition, arg_withUser, arg_withArtilce).subscribe((res: Array<CommentModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_condition = {};
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.get(arg_condition, arg_withUser, arg_withArtilce).subscribe((res: Array<CommentModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserを指定しない_withArticleを指定しない', () => {

      const arg_condition = {};

      service.get(arg_condition).subscribe((res: Array<CommentModel>) => {
        expect(res.length).toEqual(1);
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('getOfArticle', () => {
    const mockResponse: Array<CommentModel> =  [{
      _id: '123456789011',
      articleId: '123456789022',
      text: 'コメント本文',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    }];

    it ('withUserがtrue_withUserがtrue', () => {

      const arg_idOfArticle = '123456789022';
      const arg_withUser = true;
      const arg_withArticle = true;

      service.getOfArticle(arg_idOfArticle, arg_withUser, arg_withArticle).subscribe((res: Array<CommentModel>) => {
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/ofArticle/123456789022';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserがfalse_withUserがfalse', () => {

      const arg_idOfArticle = '123456789022';
      const arg_withUser = false;
      const arg_withArticle = false;

      service.getOfArticle(arg_idOfArticle, arg_withUser, arg_withArticle).subscribe((res: Array<CommentModel>) => {
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/ofArticle/123456789022';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual(null);
      expect(req.request.params.get('withArticle')).toEqual(null);

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('withUserを指定しない_withUserを指定しない', () => {

      const arg_idOfArticle = '123456789022';

      service.getOfArticle(arg_idOfArticle).subscribe((res: Array<CommentModel>) => {
        expect(res[0]._id).toEqual('123456789011');
        expect(res[0].articleId).toEqual('123456789022');
        expect(res[0].text).toEqual('コメント本文');
        expect(res[0].user).toEqual('123456789044');
        expect(res[0].created).toEqual('20150101 12:34:30');
        expect(res[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/ofArticle/123456789022';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('withUser')).toEqual(null);
      expect(req.request.params.get('withArticle')).toEqual(null);

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('register', () => {
    const mockResponse: CommentModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      text: 'コメント本文',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_comment = new CommentModel();
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';

      const arg_withUser = true;
      const arg_withArtilce = true;

      service.register(arg_comment, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_comment = new CommentModel();
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.register(arg_comment, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserを指定しない_withArticleを指定しない', () => {

      const arg_comment = new CommentModel();
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';

      service.register(arg_comment).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });




  describe('update', () => {
    const mockResponse: CommentModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      text: 'コメント本文',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:40:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_comment = new CommentModel();
      arg_comment._id = '123456789011';
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';
      arg_comment.created = '20150101 12:34:30';
      arg_comment.updated = '20150101 12:34:30';

      const arg_withUser = true;
      const arg_withArtilce = true;

      service.update(arg_comment, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_comment = new CommentModel();
      arg_comment._id = '123456789011';
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';
      arg_comment.created = '20150101 12:34:30';
      arg_comment.updated = '20150101 12:34:30';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.update(arg_comment, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserを指定しない_withArticleを指定しない', () => {

      const arg_comment = new CommentModel();
      arg_comment._id = '123456789011';
      arg_comment.articleId = '123456789022';
      arg_comment.text = 'コメント本文';
      arg_comment.user = '123456789044';
      arg_comment.created = '20150101 12:34:30';
      arg_comment.updated = '20150101 12:34:30';

      service.update(arg_comment).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:40:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(arg_comment);
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('delete', () => {
    const mockResponse: CommentModel =  {
      _id: '123456789011',
      articleId: '123456789022',
      text: 'コメント本文',
      user: '123456789044',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30',
    };

    it ('withUserがtrue_withArticleがtrue', () => {

      const arg_id = '123456789011';
      const arg_withUser = true;
      const arg_withArtilce = true;

      service.delete(arg_id, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.get('withUser')).toEqual('true');
      expect(req.request.params.get('withArticle')).toEqual('true');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserがfalse_withArticleがfalse', () => {

      const arg_id = '123456789011';
      const arg_withUser = false;
      const arg_withArtilce = false;

      service.delete(arg_id, arg_withUser, arg_withArtilce).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });


    it ('withUserを指定しない_withArticleを指定しない', () => {

      const arg_id = '123456789011';

      service.delete(arg_id).subscribe((res: CommentModel) => {
        expect(res._id).toEqual('123456789011');
        expect(res.articleId).toEqual('123456789022');
        expect(res.text).toEqual('コメント本文');
        expect(res.user).toEqual('123456789044');
        expect(res.created).toEqual('20150101 12:34:30');
        expect(res.updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/comments/123456789011';
      });

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.params.has('withUser')).toBeFalsy();
      expect(req.request.params.has('withArticle')).toBeFalsy();

      // レスポンス返却
      req.flush(mockResponse);
    });
  });
});

