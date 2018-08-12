import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  MatDialog,
} from '@angular/material';

import { ConfirmDialogComponent } from '../../shared/components';

import * as fromDraft from '../state';
import { DraftModel } from '../state/draft.model';
import { DeleteDraft } from '../state/draft.actions';



@Component({
  selector: 'app-draft-detail',
  templateUrl: './draft-detail.component.html',
  styleUrls: ['./draft-detail.component.scss'],
})
export class DraftDetailComponent {
  @Input()  draft: DraftModel;

  constructor(
    private store: Store<fromDraft.State>,
    public dialog: MatDialog,
  ) {
  }



  deleteDraft(draft: DraftModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '下書き削除',
        message: `「${draft.title}」を削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.store.dispatch(new DeleteDraft({id: draft._id}));

      // this.draftService
      //   .delete(draft._id)
      //   .subscribe(res => {
      //     this.draft = null;
      //     this.snackBar.open(`下書き「${draft.title}」を削除しました。`, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
      //     this.draftSharedService.emitChange('Deleted draft');
      //   });
    });
  }

}
