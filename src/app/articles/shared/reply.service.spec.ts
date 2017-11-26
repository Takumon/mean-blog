import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStrageService } from '../../shared/services/local-strage.service';


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
        LocalStrageService,
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

    it('リプライが取得できるか', () => {
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

  });
});

