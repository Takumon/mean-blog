import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserModel } from '../models/user.model';
import { UserService } from './user.service';
import { CudSuccessModel } from '../models/response/cud-success.model';


describe('UserService', () => {
  let injector: TestBed;
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        UserService
      ],
    });

    injector = getTestBed();
    service = injector.get(UserService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('get', () => {
    const mockResponse: UserModel[] = [
      {
        _id: '123456789011',
        userId: '123456789044',
        email: 'sample@gmail.com',
        userName: 'sampleUserName',
        isAdmin: false,
        blogTitle: 'sampleBlogTitle',
        userDescription: 'sampleUserDescription',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    ];

    it ('conditionが空オブジェクト', () => {

      const arg_condition = {};

      service.get(arg_condition).subscribe(users => {
        expect(users.length).toEqual(1);
        expect(users[0]._id).toEqual('123456789011');
        expect(users[0].userId).toEqual('123456789044');
        expect(users[0].email).toEqual('sample@gmail.com');
        expect(users[0].userName).toEqual('sampleUserName');
        expect(users[0].isAdmin).toEqual(false);
        expect(users[0].blogTitle).toEqual('sampleBlogTitle');
        expect(users[0].userDescription).toEqual('sampleUserDescription');
        expect(users[0].created).toEqual('20150101 12:34:30');
        expect(users[0].updated).toEqual('20150101 12:34:30');
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/users';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{}');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('conditionを指定しない', () => {

      service.get().subscribe(users => {
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/users';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"limit":100,"offset":0}');

      // レスポンス返却
      req.flush(mockResponse);
    });

    it ('conditionを指定する', () => {

      const arg_condition = {
        limit: 200,
        offset: 400
      };

      service.get(arg_condition).subscribe(users => {
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/users';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('condition')).toEqual('{"limit":200,"offset":400}');

      // レスポンス返却
      req.flush(mockResponse);
    });

  });



  it('getById', () => {
    const mockResponse: UserModel =       {
      _id: '123456789011',
      userId: '123456789044',
      email: 'sample@gmail.com',
      userName: 'sampleUserName',
      isAdmin: false,
      blogTitle: 'sampleBlogTitle',
      userDescription: 'sampleUserDescription',
      created: '20150101 12:34:30',
      updated: '20150101 12:34:30'
    };

    const arg_id = '123456789044';

    service.getById(arg_id).subscribe(user => {
      expect(user._id).toEqual('123456789011');
      expect(user.userId).toEqual('123456789044');
      expect(user.email).toEqual('sample@gmail.com');
      expect(user.userName).toEqual('sampleUserName');
      expect(user.isAdmin).toEqual(false);
      expect(user.blogTitle).toEqual('sampleBlogTitle');
      expect(user.userDescription).toEqual('sampleUserDescription');
      expect(user.created).toEqual('20150101 12:34:30');
      expect(user.updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/users/123456789044';
    });

    expect(req.request.method).toEqual('GET');

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('create', () => {
    const mockResponse: CudSuccessModel<UserModel> = {
      message: 'ユーザを登録しました。',
      obj: {
        _id: '123456789011',
        userId: '123456789044',
        email: 'sample@gmail.com',
        userName: 'sampleUserName',
        isAdmin: false,
        blogTitle: 'sampleBlogTitle',
        userDescription: 'sampleUserDescription',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      }
    };


    // const arg_id = '123456789011';

    const arg_model = new UserModel();
    arg_model.userId = '123456789044',
    arg_model.email = 'sample@gmail.com',
    arg_model.userName = 'sampleUserName',
    arg_model.isAdmin = false,
    arg_model.blogTitle = 'sampleBlogTitle',
    arg_model.userDescription = 'sampleUserDescription',

    service.create(arg_model).subscribe(res => {
      expect(res.message).toEqual('ユーザを登録しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.userId).toEqual('123456789044');
      expect(res.obj.email).toEqual('sample@gmail.com');
      expect(res.obj.userName).toEqual('sampleUserName');
      expect(res.obj.isAdmin).toEqual(false);
      expect(res.obj.blogTitle).toEqual('sampleBlogTitle');
      expect(res.obj.userDescription).toEqual('sampleUserDescription');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:34:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/users';
    });

    expect(req.request.method).toEqual('POST');

    // レスポンス返却
    req.flush(mockResponse);
  });



  it('update', () => {
    const mockResponse: CudSuccessModel<UserModel> = {
      message: 'ユーザを更新しました。',
      obj: {
        _id: '123456789011',
        userId: '123456789044',
        email: 'sample@gmail.com',
        userName: 'sampleUserName',
        isAdmin: false,
        blogTitle: 'sampleBlogTitle',
        userDescription: 'sampleUserDescription',
        created: '20150101 12:34:30',
        updated: '20150101 12:40:30'
      }
    };


    const arg_model = new UserModel();
    arg_model._id = '123456789011';
    arg_model.email = 'sample@gmail.com';
    arg_model.userName = 'sampleUserName';
    arg_model.userDescription = 'updatedSampleUserDescription';

    const arg_avator = 'avator';
    const arg_profileBackground = 'profileBackground';


    service.update(arg_model, arg_avator, arg_profileBackground).subscribe(res => {
      expect(res.message).toEqual('ユーザを更新しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.userId).toEqual('123456789044');
      expect(res.obj.email).toEqual('sample@gmail.com');
      expect(res.obj.userName).toEqual('sampleUserName');
      expect(res.obj.isAdmin).toEqual(false);
      expect(res.obj.blogTitle).toEqual('sampleBlogTitle');
      expect(res.obj.userDescription).toEqual('sampleUserDescription');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:40:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/users/123456789011';
    });

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.get('userDescription')).toEqual('updatedSampleUserDescription');
    expect(req.request.body.get('email')).toEqual('sample@gmail.com');
    expect(req.request.body.get('userName')).toEqual('sampleUserName');
    expect(req.request.body.get('avator')).toEqual('avator');
    expect(req.request.body.get('profileBackground')).toEqual('profileBackground');

    // レスポンス返却
    req.flush(mockResponse);
  });


  it('delete', () => {
    const mockResponse: CudSuccessModel<UserModel> = {
      message: 'ユーザを削除しました。',
      obj: {
        _id: '123456789011',
        userId: '123456789044',
        email: 'sample@gmail.com',
        userName: 'sampleUserName',
        isAdmin: false,
        blogTitle: 'sampleBlogTitle',
        userDescription: 'sampleUserDescription',
        created: '20150101 12:34:30',
        updated: '20150101 12:40:30',
        deleted: '20150101 12:44:30'
      }
    };

    const arg_id = '123456789011';

    service.delete(arg_id).subscribe(res => {
      expect(res.message).toEqual('ユーザを削除しました。');
      expect(res.obj._id).toEqual('123456789011');
      expect(res.obj.userId).toEqual('123456789044');
      expect(res.obj.email).toEqual('sample@gmail.com');
      expect(res.obj.userName).toEqual('sampleUserName');
      expect(res.obj.isAdmin).toEqual(false);
      expect(res.obj.blogTitle).toEqual('sampleBlogTitle');
      expect(res.obj.userDescription).toEqual('sampleUserDescription');
      expect(res.obj.created).toEqual('20150101 12:34:30');
      expect(res.obj.updated).toEqual('20150101 12:40:30');
      expect(res.obj.deleted).toEqual('20150101 12:44:30');
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/users/123456789011';
    });

    expect(req.request.method).toEqual('DELETE');

    // レスポンス返却
    req.flush(mockResponse);
  });
});
