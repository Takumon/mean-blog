import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of } from 'rxjs';

import { DraftEffects } from './draft.effects';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftService } from '../shared';
import { SharedModule } from '../../shared/shared.module';

class MockDraftServcie {

}

describe('DraftEffects', () => {
  let effects: DraftEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        DraftEffects,
        provideMockActions(() => of()),
        { provide: DraftService, useClass: MockDraftServcie }
      ]
    });

    effects = TestBed.get(DraftEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
