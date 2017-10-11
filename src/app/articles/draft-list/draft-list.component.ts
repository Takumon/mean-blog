import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {
  MdSnackBar,
  MdInputModule,
} from '@angular/material';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { ArticleService } from '../shared/article.service';
import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';

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
    this.route.parent.params.subscribe( params => {
      const userId = params['_userId'];
      const condition = {
        author: { userId: userId }
      };
      this.draftService.get(condition)
      .subscribe(drafts => {
        this.drafts = drafts as Array<DraftModel>;
        if (drafts && drafts.length > 0) {
          this.selectDraft(drafts[0]);
        }
      });
    });
  }

  deleteDraft(): void {

  }

}
