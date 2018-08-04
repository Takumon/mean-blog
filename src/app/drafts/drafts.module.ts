import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { ArticleService } from '../articles/shared/article.service';

import { DraftSharedService } from './shared/draft-shared.service';
import { DraftService } from './shared/draft.service';

import { DraftListComponent } from './draft-list/draft-list.component';
import { DraftDetailComponent } from './draft-detail/draft-detail.component';
import { DraftEditComponent } from './draft-edit/draft-edit.component';
import { DraftsRoutingModule } from './drafts-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    DraftListComponent,
    DraftDetailComponent,
    DraftEditComponent,
  ],
  imports: [
    DraftsRoutingModule,
    SharedModule,
  ],
  providers: [
    DraftSharedService,
    ArticleService,
    DraftService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DraftsModule { }
