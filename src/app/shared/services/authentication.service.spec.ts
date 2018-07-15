import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService, LoginSuccessInfo, CheckStateInfo } from './authentication.service';
import { LocalStorageService, LOCALSTORAGE_KEY } from './local-storage.service';
import { UserModel } from '../../users/shared/user.model';
import { CudSuccessModel } from '../models/response/cud-success.model';


describe('SearchConditionService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthenticationService,
        LocalStorageService
      ],
    });

    service = TestBed.get(AuthenticationService);
    httpMock = TestBed.get(HttpTestingController);


    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  afterEach(() => {
    // 余分なリクエストがないかチェック
    httpMock.verify();
  });


  describe('login', () => {

    it('認証成功時', () => {
      const mockLoginUser = new UserModel();
      const mockResponse: LoginSuccessInfo = {
        success: true,
        message: '認証成功',
        token: 'sampleToken',
        user: mockLoginUser
      };

      expect(service.loginUser).toBeUndefined();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(service.isFinishedCheckState).toBeFalsy();

      const arg_user = {
        userId: '123456789012',
        password: 'samplePassword'
      };

      service.login(arg_user).subscribe((res: LoginSuccessInfo) => {
        expect(res.success).toBeTruthy();
        expect(res.message).toEqual('認証成功');
        expect(res.token).toEqual('sampleToken');
        expect(res.user).toEqual(mockLoginUser);

        expect(service.loginUser).toEqual(mockLoginUser);
        expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('sampleToken');
        expect(service.isFinishedCheckState).toBeTruthy();
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/login';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body.userId).toEqual('123456789012');
      expect(req.request.body.password).toEqual('samplePassword');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('認証失敗時', () => {
      const mockLoginUser = new UserModel();
      const mockResponse: LoginSuccessInfo = {
        success: false,
        message: '認証失敗',
        token: null,
        user: null
      };

      expect(service.loginUser).toBeUndefined();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(service.isFinishedCheckState).toBeFalsy()

      const arg_user = {
        userId: '123456789012',
        password: 'samplePassword'
      };

      service.login(arg_user).subscribe((res: LoginSuccessInfo) => {
        expect(res.success).toBeFalsy();
        expect(res.message).toEqual('認証失敗');
        expect(res.token).toBeNull();
        expect(res.user).toBeNull();

        expect(service.loginUser).toBeUndefined();
        expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
        expect(service.isFinishedCheckState).toBe(true);
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/login';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body.userId).toEqual('123456789012');
      expect(req.request.body.password).toEqual('samplePassword');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('register', () => {

    it('認証成功時', () => {
      const mockLoginUser = new UserModel();
      const mockResponse: LoginSuccessInfo = {
        success: true,
        message: 'ユーザ情報を新規作成しました。',
        token: 'sampleToken',
        user: mockLoginUser
      };

      expect(service.loginUser).toBeUndefined();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(service.isFinishedCheckState).toBeFalsy();

      const arg_user = {
        userId: '123456789012',
        password: 'samplePassword',
        confirmPassword: 'samplePassword'
      };

      service.register(arg_user).subscribe((res: LoginSuccessInfo) => {
        expect(res.success).toBeTruthy();
        expect(res.message).toEqual('ユーザ情報を新規作成しました。');
        expect(res.token).toEqual('sampleToken');
        expect(res.user).toEqual(mockLoginUser);

        expect(service.loginUser).toEqual(mockLoginUser);
        expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('sampleToken');
        expect(service.isFinishedCheckState).toBeTruthy();
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/register';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body.userId).toEqual('123456789012');
      expect(req.request.body.password).toEqual('samplePassword');
      expect(req.request.body.confirmPassword).toEqual('samplePassword');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('認証失敗時', () => {
      const mockLoginUser = new UserModel();
      const mockResponse: LoginSuccessInfo = {
        success: false,
        message: 'ユーザ情報を登録に失敗しました。',
        token: null,
        user: null
      };

      expect(service.loginUser).toBeUndefined();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(service.isFinishedCheckState).toBeFalsy();

      const arg_user = {
        userId: '123456789012',
        password: 'samplePassword',
        confirmPassword: 'samplePassword'
      };

      service.register(arg_user).subscribe((res: LoginSuccessInfo) => {
        expect(res.success).toBeFalsy();
        expect(res.message).toEqual('ユーザ情報を登録に失敗しました。');
        expect(res.token).toBeNull();
        expect(res.user).toBeNull();

        expect(service.loginUser).toBeUndefined();
        expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
        expect(service.isFinishedCheckState).toBe(true);
      });


      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/register';
      });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body.userId).toEqual('123456789012');
      expect(req.request.body.password).toEqual('samplePassword');
      expect(req.request.body.confirmPassword).toEqual('samplePassword');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });

  it('changePassword', () => {
    const mockLoginUser = new UserModel();
    const mockResponse: CudSuccessModel<UserModel> = {
      message: 'パスワードを更新しました。',
      obj: mockLoginUser
    };


    const loginUser = new UserModel();
    loginUser._id = '123456789012';
    service.loginUser = loginUser;
    service.isFinishedCheckState = true;
    localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'sampleToken');

    expect(service.loginUser).toEqual(loginUser);
    expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('sampleToken');
    expect(service.isFinishedCheckState).toBeTruthy();

    const arg_passwordInfo = {
      oldPassword: 'oldPassword',
      newPassword: 'samplePassword',
      newConfirmPassword: 'samplePassword'
    };

    service.changePassword(arg_passwordInfo).subscribe((res: CudSuccessModel<UserModel>) => {
      expect(res.message).toEqual('パスワードを更新しました。');
      expect(res.obj).toEqual(mockLoginUser);

      expect(service.loginUser).toEqual(mockLoginUser);
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('sampleToken');
      expect(service.isFinishedCheckState).toBeTruthy();
    });


    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return request.url === '/api/authenticate/changePassword';
    });

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.oldPassword).toEqual('oldPassword');
    expect(req.request.body.newPassword).toEqual('samplePassword');
    expect(req.request.body.newConfirmPassword).toEqual('samplePassword');

    // レスポンス返却
    req.flush(mockResponse);
  });

  describe('checkState', () => {
    it('未認証時', () => {
      const mockResponse: CheckStateInfo = {
        success: false,
        message: 'トークン認証に失敗しました。',
        error: 'error message'
      };

      expect(service.isFinishedCheckState).toBeFalsy();

      service.checkState().subscribe( (res: CheckStateInfo) => {
        expect(res.success).toBeFalsy();
        expect(res.message).toEqual('トークン認証に失敗しました。');
        expect(res.error).toEqual('error message');

        expect(service.isFinishedCheckState).toBe(true);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/check-state';
      });

      expect(req.request.method).toEqual('GET');

      // レスポンス返却
      req.flush(mockResponse);
    });


    it('認証時', () => {
      const mockUser = new UserModel();
      mockUser.isAdmin = false;
      mockUser._id = '123456789012';
      const mockResponse: CheckStateInfo = {
        success: true,
        message: '認証済',
        token: 'sampleToken',
        user: mockUser
      };

      expect(service.isFinishedCheckState).toBeFalsy();

      service.checkState().subscribe( (res: CheckStateInfo) => {
        expect(res.success).toBeTruthy();
        expect(res.message).toEqual('認証済');

        expect(service.isFinishedCheckState).toBeTruthy();
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.url === '/api/authenticate/check-state';
      });

      expect(req.request.method).toEqual('GET');

      // レスポンス返却
      req.flush(mockResponse);
    });
  });


  describe('logout', () => {

    it('ログイン時', () => {
      const loginUser = new UserModel();
      service.loginUser = loginUser;
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'sampleToken');

      expect(service.loginUser).toEqual(loginUser);
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('sampleToken');

      expect(service.logout()).toBeFalsy();

      expect(service.loginUser).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
    });

    it('未ログイン時', () => {
      expect(service.loginUser).toBeUndefined();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();

      expect(service.logout()).toBeFalsy();

      expect(service.loginUser).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
    });
  });


  describe('isLogin', () => {

    it('未ログイン時', () => {
      expect(service.isLogin()).toBeFalsy();
    });

    it('ログイン時', () => {
      const loginUser = new UserModel();
      service.loginUser = loginUser;

      expect(service.isLogin()).toBeTruthy();
    });
  });

  describe('isAdmin', () => {

    it('未ログイン時', () => {
      expect(service.isAdmin()).toBeFalsy();
    });

    it('ログイン時 一般ユーザ', () => {
      const loginUser = new UserModel();
      loginUser.isAdmin = false;
      service.loginUser = loginUser;

      expect(service.isAdmin()).toBeFalsy();
    });

    it('ログイン時 一般ユーザ', () => {
      const loginUser = new UserModel();
      loginUser.isAdmin = true;
      service.loginUser = loginUser;

      expect(service.isLogin()).toBeTruthy();
    });
  });

  describe('getToken', () => {

    it('トークンがない時', () => {
      expect(service.getToken()).toBeNull();
    });

    it('トークンがある時', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'sampleToken');

      expect(service.getToken()).toEqual('sampleToken');
    });
  });

  describe('hasToken', () => {

    it('トークンがない時', () => {
      expect(service.hasToken()).toBeFalsy();
    });

    it('トークンがある時', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'sampleToken');

      expect(service.hasToken()).toBeTruthy();
    });
  });





});

