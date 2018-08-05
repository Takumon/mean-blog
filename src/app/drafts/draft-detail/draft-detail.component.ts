import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Constant } from '../../shared/constant';
import { ConfirmDialogComponent } from '../../shared/components';

import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';
import { DraftSharedService } from '../shared/draft-shared.service';

@Component({
  selector: 'app-draft-detail',
  templateUrl: './draft-detail.component.html',
  styleUrls: ['./draft-detail.component.scss'],
})
export class DraftDetailComponent implements OnInit, OnDestroy {
  private Constant = Constant;
  draft: DraftModel;
  private onDestroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private draftService: DraftService,
    public dialog: MatDialog,
    private draftSharedService: DraftSharedService,
  ) {
  }

  ngOnInit(): void {
    this.getDraft();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  getDraft(): void {
    this.route.params
    .pipe(takeUntil(this.onDestroy))
    .subscribe( params => {
      this.draftService.getById(params['_id'])
      .subscribe(draft => {
        this.draft = draft as DraftModel;
      });
    });
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

      this.draftService
      .delete(draft._id)
      .subscribe(res => {
        this.draft = null;
        this.snackBar.open(`下書き「${draft.title}」を削除しました。`, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        this.draftSharedService.emitChange('Deleted draft');
      });
    });
  }

}
