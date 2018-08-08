import { Component, OnInit } from '@angular/core';
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



/**
 * 下書きを投稿済みと未投稿に分類した結果
 */
class GroupedDrafts {
  notPosted: Array<DraftModel> = [];
  posted: Array<DraftModel> = [];

  isEmpty(): boolean {
    return (!this.notPosted || this.notPosted.length === 0) && (!this.posted || this.posted.length === 0);
  }
}

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
})
export class DraftListComponent implements OnInit {
  public groupedDrafts: GroupedDrafts;

  loading$: Observable<boolean>;
  groupedDrafts$: Observable<GroupedDrafts>;

  constructor(
    private store: Store<fromDraft.State>,

    private auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
  ) {
    this.loading$ = this.store.select(fromDraft.getLoading);
    this.groupedDrafts$ = this.store.select(fromDraft.getDrafts).pipe(
      tap(drafts => this.routeNamesService.name.next(`下書き一覧 ( ${drafts ? drafts.length : 0} / 10件 )`)),
      map(drafts => this.convertToGroupedDrafts(drafts))
    );

        // ドラフト一覧は画面左側に表示し、ドラフト詳細をメイン領域に表示する
        // ただこの時、ドラフト一覧にアクセスした場合、どのドラフトの詳細を表示するかが決まっていない (この時子コンポーネントのルータが存在しないので、それを見て判断している)
        // そのため決め打ちで一番最初の下書きを選択する
        // また意図的に状態をリフレッシュしたい時は、ドラフト詳細が表示された状態でも、同様のリフレッシュ処理を行う
        // if (!this.route.firstChild || isRefresh) {
        //   const _id = this.groupedDrafts.notPosted.length > 0
        //     ? this.groupedDrafts.notPosted[0]._id
        //     : this.groupedDrafts.posted[0]._id;

        //   this.router.navigate(['drafts', _id]);
        // }

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

    return result;
  }
}
