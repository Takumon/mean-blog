import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DraftSharedService } from './draft-shared.service';


describe('SharedService', () => {
  let injector: TestBed;
  let service: DraftSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        DraftSharedService,
      ],
    });

    injector = getTestBed();
    service = injector.get(DraftSharedService);
  });

  it('emitChange', () => {
    service.changeEmitted$.subscribe(res => {
      expect(res.sampleData).toEqual('sampleData');
    });

    const arg_change = {
      sampleData: 'sampleData'
    };
    service.emitChange(arg_change);
  });
});
