import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {
  MdSnackBar,
  MdInputModule,
} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { ArticleService } from '../shared/article.service';
import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
})
export class DraftListComponent implements OnInit, OnDestroy {

  drafts: Array<DraftModel>;
  selectedDraft: DraftModel;
  private onDestroy = new Subject();

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

    public auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    private sharedService: SharedService,

    private articleService: ArticleService,
    private draftService: DraftService,
  ) {
  }

  ngOnInit() {
    this.routeNamesService.name.next(`下書き一覧`);
    this.sharedService.changeEmitted$
    .takeUntil(this.onDestroy)
    .subscribe(text => {
      const isRefresh = true;
      this.getDrafts(isRefresh);
    });
    this.getDrafts();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  getDrafts(isRefresh: boolean = false): void {
    if (this.route.firstChild) {
      this.route.firstChild.params
      .takeUntil(this.onDestroy)
      .subscribe( params => {
        const condition = { userId: this.auth.loginUser._id };
        this.draftService.get(condition)
        .subscribe(drafts => {
          this.drafts = drafts as Array<DraftModel>;
          if (isRefresh) {
            this.router.navigate(['drafts', drafts[0]._id]);
          }
        });
      });
    } else {
      const condition = { userId: this.auth.loginUser._id };
      this.draftService.get(condition)
      .subscribe(drafts => {
        this.drafts = drafts;
        this.router.navigate(['drafts', drafts[0]._id]);
      });
    }
  }
}
