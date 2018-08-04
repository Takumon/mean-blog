import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LocalStorageService, LOCALSTORAGE_KEY } from './local-storage.service';
import { JwtService } from './jwt.service';


describe('JwtService', () => {
  let injector: TestBed;
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        JwtService,
        LocalStorageService
      ],
    });

    injector = getTestBed();
    service = injector.get(JwtService);


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

  describe('getHeaders', () => {

    it('ローカルストレージに値がない場合', () => {
        expect(service.getHeaders()).toBeUndefined();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');

      expect(service.getHeaders().get('x-access-token')).toEqual('SampleToken');
    });
  });



  describe('getRequestOptions', () => {

    it('ローカルストレージに値がない場合', () => {
        expect(service.getRequestOptions()).toBeUndefined();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');

      expect(service.getRequestOptions().headers.get('x-access-token')).toEqual('SampleToken');
    });
  });

});
