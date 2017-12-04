import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtService } from '../../shared/services/jwt.service';
import { LocalStrageService } from '../../shared/services/local-strage.service';

import { ArticleService } from './article.service';


describe('ArticleService', () => {
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

    service = TestBed.get(ArticleService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('オブジェクトが生成されるべき', () => {
    expect(service).toBeTruthy();
  });

});
