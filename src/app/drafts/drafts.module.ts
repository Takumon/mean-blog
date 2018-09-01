import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { ArticleService } from '../shared/services';

import {
  DraftSharedService,
  DraftService,
} from './shared';

import * as fromDrafts from './state';

import { DraftListComponent } from './draft-list/draft-list.component';
import { DraftDetailComponent } from './draft-detail/draft-detail.component';
import { DraftEditComponent } from './draft-edit/draft-edit.component';
import { DraftsRoutingModule } from './drafts-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { DraftEffects } from './state/draft.effects';
import { DraftEditAreaComponent } from './draft-edit/draft-edit-area.component';



@NgModule({
  declarations: [
    DraftListComponent,
    DraftDetailComponent,
    DraftEditComponent,
    DraftEditAreaComponent,
  ],
  imports: [
    DraftsRoutingModule,
    SharedModule,
    StoreModule.forFeature('draft', fromDrafts.reducers, { metaReducers: fromDrafts.metaReducers }),
    EffectsModule.forFeature([DraftEffects]),
  ],
  providers: [
    DraftSharedService,
    ArticleService,
    DraftService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DraftsModule { }
