import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DraftEffects } from './draft.effects';

describe('DraftEffects', () => {
  let actions$: Observable<any>;
  let effects: DraftEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DraftEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DraftEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
