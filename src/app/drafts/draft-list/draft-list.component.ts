import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromDraft from '../state';

import {
  AuthenticationService,
  RouteNamesService,
} from '../../shared/services';

import { DraftModel } from '../state/draft.model';
import { LoadDrafts } from '../state/draft.actions';
import { OrderByPipe } from '../../shared/pipes';



/**
 * 下書きを投稿済みと未投稿に分類した結果
 */
class GroupedDrafts {
  notPosted: Array<DraftModel> = [];
  posted: Array<DraftModel> = [];


  /**
   * 一件検索. 見つからない場合nullを返す.
   */
  findById(_id: string): DraftModel {
    return [...this.notPosted, ...this.posted].find(p => p._id === _id);
  }

  /**
   * 下書きが１件も存在しないか.
   */
  isEmpty(): boolean {
    return (!this.notPosted || this.notPosted.length === 0) && (!this.posted || this.posted.length === 0);
  }

  /**
   * 最初の下書きを取得、空の場合はnullを返す.
   */
  getFirst(): DraftModel {
    if (this.isEmpty()) {
      return null;
    }

    if (this.notPosted && this.notPosted.length > 0) {
      return this.notPosted[0];
    }

    if (this.posted && this.posted.length > 0) {
      return this.posted[0];
    }
  }
}

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
  providers: [OrderByPipe]
})
export class DraftListComponent implements OnInit {
  public groupedDrafts: GroupedDrafts;

  loading$: Observable<boolean>;
  groupedDrafts$: Observable<GroupedDrafts>;
  selectedDraft: DraftModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oderByPipe: OrderByPipe,
    private auth: AuthenticationService,
    private store: Store<fromDraft.State>,
    private routeNamesService: RouteNamesService,
  ) {
    this.loading$ = this.store.select(fromDraft.getLoading);
    this.groupedDrafts$ = this.store.select(fromDraft.getDrafts).pipe(
      tap(drafts => this.routeNamesService.name.next(`下書き一覧 ( ${drafts ? drafts.length : 0} / 10件 )`)),
      map(drafts => this.convertToGroupedDrafts(drafts)),
      tap(groupedDrafts => {
        if (groupedDrafts.isEmpty()) {
          return;
        }

        // URLで指定したIDのドラフトを取得する
        // 未指定の場合は最初のドラストを指定する
        this.route.params.subscribe(params => {
          if (params['_id']) {

            const draft = groupedDrafts.findById(params['_id']);

            if (draft) {
              this.selectedDraft = draft;
              return;
            }
          }

          // id未指定または、指定した下書きが見つからない場合
          this.router.navigate(['drafts', groupedDrafts.getFirst()._id])
        });

      })
    );
  }

  ngOnInit() {
    const condition = { userId: this.auth.loginUser._id };
    this.store.dispatch(new LoadDrafts( { condition }));
  }


  /**
   * 指定した下書きを投稿済と未投稿に分類する
   *
   * @param drafts 下書きのリスト
   * @returns 投稿済と未投稿に分類した結果
   */
  convertToGroupedDrafts(drafts: Array<DraftModel>): GroupedDrafts {
    const result = new GroupedDrafts();

    if (!drafts || drafts.length === 0) {
      return result;
    }

    drafts.forEach(d =>
      d.articleId
        ? result.posted.push(d)
        : result.notPosted.push(d)
    );

    result.notPosted = this.oderByPipe.transform(result.notPosted, ['-created']);
    result.posted = this.oderByPipe.transform(result.posted, ['-created']);

    return result;
  }
}
