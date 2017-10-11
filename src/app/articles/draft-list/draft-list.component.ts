import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {
  MdSnackBar,
  MdDialog,
  MdInputModule,
} from '@angular/material';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { ArticleService } from '../shared/article.service';
import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
})
export class DraftListComponent implements OnInit {

  drafts: Array<DraftModel>;
  selectedDraft: DraftModel;

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

    public auth: AuthenticationService,
    private routeNamesService: RouteNamesService,

    private articleService: ArticleService,
    private draftService: DraftService,
    public dialog: MdDialog,
  ) {
  }

  ngOnInit() {
    this.routeNamesService.name.next(`下書き一覧`);
    this.getDrafts();
  }

  selectDraft(draft: DraftModel): void {
    this.selectedDraft = draft;
  }

  isSelected(draftId: any): boolean {
    return this.selectedDraft._id === draftId;
  }

  getDrafts(): void {
    this.route.params.subscribe( params => {
      const draftId = params['_id'];
      const condition = { userId: this.auth.loginUser._id };
      this.draftService.get(condition)
      .subscribe(drafts => {
        this.drafts = drafts as Array<DraftModel>;
        if (drafts && drafts.length > 0) {
          if (draftId) {
            for (const draft of drafts) {
              if (draft._id === draftId) {
                this.selectDraft(draft);
                break;
              }
            }
          } else {
            this.router.navigate(['drafts', drafts[0]._id]);
          }
        }
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
        this.snackBar.open(`下書き「${draft.title}」を削除しました。`, null, {duration: 3000});
        this.getDrafts();
      });
    });
  }

}
