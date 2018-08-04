import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImageService } from './image.service';
import { ImageModel, ImageType } from '../models/image.model';


describe('SearchConditionService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ImageService,
      ],
    });

    service = TestBed.get(ImageService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    // httpMock.verify();
  });


  it('get', () => {
    const mockResponse: ImageModel[] =  [
      {
        _id: '123456789011',
        author: '123456789011',
        type: ImageType.OF_ARTICLE,
        data:  'sampleData',
        contentType: 'sampleContentType',
        fileName: 'sampleDataFileName',
      }
    ];

    service.get().subscribe((res: ImageModel[]) => {
      expect(res.length).toEqual(1);
      expect(res[0]._id).toEqual('123456789011');
      expect(res[0].author).toEqual('123456789011');
      expect(res[0].type).toEqual(300);
      expect(res[0].data).toEqual('sampleData');
      expect(res[0].contentType).toEqual('sampleContentType');
      expect(res[0].fileName).toEqual('sampleDataFileName');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/images/ofArticle';
    });

    expect(req.request.method).toEqual('GET');

    // レスポンス返却
    req.flush(mockResponse);
  });



  it('getById', () => {
    const mockResponse: ImageModel =  {
      _id: '123456789011',
      author: '123456789011',
      type: ImageType.OF_ARTICLE,
      data:  'sampleData',
      contentType: 'sampleContentType',
      fileName: 'sampleDataFileName',
    };


    const arg_id = '123456789011';

    service.getById(arg_id).subscribe((res: ImageModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.author).toEqual('123456789011');
      expect(res.type).toEqual(300);
      expect(res.data).toEqual('sampleData');
      expect(res.contentType).toEqual('sampleContentType');
      expect(res.fileName).toEqual('sampleDataFileName');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/images/ofArticle/123456789011';
    });

    expect(req.request.method).toEqual('GET');

    // レスポンス返却
    req.flush(mockResponse);
  });





  it('register', () => {
    const mockResponse =  {
      _id: '123456789011',
      author: '123456789011',
      type: ImageType.OF_ARTICLE,
      data:  'sampleData',
      contentType: 'sampleContentType',
      fileName: 'sampleDataFileName',
    };

    const arg_imageFile = new File(['parts'], 'SampleDataFileName');

    service.register(arg_imageFile).subscribe( (res: ImageModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.author).toEqual('123456789011');
      expect(res.type).toEqual(300);
      expect(res.data).toEqual('sampleData');
      expect(res.contentType).toEqual('sampleContentType');
      expect(res.fileName).toEqual('sampleDataFileName');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/images/ofArticle';
    });

    expect(req.request.method).toEqual('POST');
    expect(req.request.body.get('image')).toEqual(arg_imageFile);
    // レスポンス返却
    req.flush(mockResponse);
  });




  it('delete', () => {
    const mockResponse =  {
      _id: '123456789011',
      author: '123456789011',
      type: ImageType.OF_ARTICLE,
      data:  'sampleData',
      contentType: 'sampleContentType',
      fileName: 'sampleDataFileName',
    };

    const arg_id = '123456789011';

    service.delete(arg_id).subscribe( (res: ImageModel) => {
      expect(res._id).toEqual('123456789011');
      expect(res.author).toEqual('123456789011');
      expect(res.type).toEqual(300);
      expect(res.data).toEqual('sampleData');
      expect(res.contentType).toEqual('sampleContentType');
      expect(res.fileName).toEqual('sampleDataFileName');
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/images/ofArticle/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');
    // レスポンス返却
    req.flush(mockResponse);
  });
});

