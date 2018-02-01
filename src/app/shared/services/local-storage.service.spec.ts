import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CudSuccessModel } from '../../shared/models/response/cud-success.model';
import { LocalStorageService, KEY } from './local-storage.service';


describe('UserService', () => {
  let injector: TestBed;
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        LocalStorageService
      ],
    });

    injector = getTestBed();
    service = injector.get(LocalStorageService);

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

  describe('get', () => {

    it('ローカルストレージに値がない場合', () => {
        expect(service.get(KEY.TOKEN)).toBeNull();
        expect(service.get(KEY.SELECTED_CONDITION_ID)).toBeNull();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(service.get(KEY.TOKEN)).toEqual('SampleToken');
      expect(service.get(KEY.SELECTED_CONDITION_ID)).toEqual('SampleId');
    });
  });

  describe('set', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      service.set(KEY.TOKEN, 'SampleToken');
      service.set(KEY.SELECTED_CONDITION_ID, 'SampleId');

      expect(localStorage.getItem(KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      service.set(KEY.TOKEN, 'SampleToken2');
      service.set(KEY.SELECTED_CONDITION_ID, 'SampleId2');

      expect(localStorage.getItem(KEY.TOKEN.toString())).toEqual('SampleToken2');
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId2');
    });
  });


  describe('remove', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      service.remove(KEY.TOKEN);
      service.remove(KEY.SELECTED_CONDITION_ID);

      expect(localStorage.getItem(KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toBeNull();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      service.remove(KEY.TOKEN);
      service.remove(KEY.SELECTED_CONDITION_ID);

      expect(localStorage.getItem(KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toBeNull();
    });
  });


  describe('has', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      expect(service.has(KEY.TOKEN)).toBeFalsy();
      expect(service.has(KEY.SELECTED_CONDITION_ID)).toBeFalsy();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      expect(service.has(KEY.TOKEN)).toBeTruthy();
      expect(service.has(KEY.SELECTED_CONDITION_ID)).toBeTruthy();
    });
  });

});
