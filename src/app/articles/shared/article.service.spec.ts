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

});
