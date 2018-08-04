import { TestBed, getTestBed } from '@angular/core/testing';

import { RouteNamesService } from './route-names.service';


describe('RouteNamesService', () => {
  let injector: TestBed;
  let service: RouteNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteNamesService
      ],
    });

    injector = getTestBed();
    service = injector.get(RouteNamesService);
  });

  it('name', () => {
    service.name.subscribe(name => {
      expect(name).toEqual('sampleRouterName');
    });

    service.name.next('sampleRouterName');
  });
});
