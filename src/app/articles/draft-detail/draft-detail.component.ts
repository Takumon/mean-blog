import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatDialog,
  MatInputModule,
} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Constant } from '../../shared/constant'
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { SharedService } from '../../shared/services/shared.service';

import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';

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
    private router: Router,
    public snackBar: MatSnackBar,
    private draftService: DraftService,
    public dialog: MatDialog,
    private sharedService: SharedService,
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
    .takeUntil(this.onDestroy)
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
        this.sharedService.emitChange('Deleted draft');
      });
    });
  }

}
