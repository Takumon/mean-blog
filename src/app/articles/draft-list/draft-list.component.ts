import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../shared/draft.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { SharedService } from '../../shared/services/shared.service';

interface GroupedDrafts {
  notPosted: Array<DraftModel>;
  posted: Array<DraftModel>;
}

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
})
export class DraftListComponent implements OnInit, OnDestroy {

  groupedDrafts: GroupedDrafts;
  notFound: boolean;
  private onDestroy = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    public auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    private sharedService: SharedService,

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


  // TODO 0件時の処理
  getDrafts(isRefresh: boolean = false): void {
    const condition = { userId: this.auth.loginUser._id };
    this.draftService.get(condition)
    .subscribe(drafts => {
      if (!drafts || drafts.length === 0) {
        this.notFound = true;
        this.groupedDrafts = null;
        this.router.navigate(['drafts']);
        return;
      }

      this.groupedDrafts = this.grouping(drafts);
      if (!this.route.firstChild || isRefresh) {
        // 決め打ちで一番最初の下書きを選択する
        const _id = this.groupedDrafts.notPosted.length > 0
          ? this.groupedDrafts.notPosted[0]._id
          : this.groupedDrafts.posted[0]._id;
        this.router.navigate(['drafts', _id]);
      }
    });
  }

  grouping(drafts: Array<DraftModel>): GroupedDrafts {
    const result = {
      notPosted: [],
      posted: []
    };

    if (!drafts || drafts.length === 0) {
      return result;
    }

    drafts.forEach(d => {
      if (d.posted) {
        result.posted.push(d);
      } else {
        result.notPosted.push(d);
      }
    });

    return result;
  }
}
