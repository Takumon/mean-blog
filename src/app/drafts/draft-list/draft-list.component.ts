import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  AuthenticationService,
  RouteNamesService,
} from '../../shared/services';

import { DraftService } from '../shared/draft.service';
import { DraftModel } from '../state/draft.model';
import { DraftSharedService } from '../shared/draft-shared.service';



/**
 * 下書きを投稿済みと未投稿に分類した結果
 */
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
  public groupedDrafts: GroupedDrafts;
  public notFound: boolean;

  private onDestroy = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    private auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    private draftSharedService: DraftSharedService,
    private draftService: DraftService,
  ) {
  }

  ngOnInit() {
    // どこかから（子コンポーネントから）発火される、リフレッシュイベントを購読する
    // イベント発生時にドラフトをサーバから再取得し画面をリフレッシュする
    this.draftSharedService.changeEmitted$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.getDrafts(true));

    // 画面初期表示時にドラフトをサーバから取得する
    this.getDrafts();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  /**
   * ドラフトをサーバ側から取得し画面のプロパティに設定する.
   *
   * @param isRefresh ドラフト画面初期表示時（ドラフトリストの一番上部ものの詳細を表示した状態）にリフレッシュするかどうか
   */
  getDrafts(isRefresh: boolean = false): void {
    const condition = { userId: this.auth.loginUser._id };
    this.draftService.get(condition)
      .subscribe(drafts => {
        this.routeNamesService.name.next(`下書き一覧 ( ${drafts ? drafts.length : 0} / 10件 )`);

        if (!drafts || drafts.length === 0) {
          this.notFound = true;
          this.groupedDrafts = null;
          this.router.navigate(['drafts']);
          return;
        }

        this.groupedDrafts = this.grouping(drafts);

        // ドラフト一覧は画面左側に表示し、ドラフト詳細をメイン領域に表示する
        // ただこの時、ドラフト一覧にアクセスした場合、どのドラフトの詳細を表示するかが決まっていない (この時子コンポーネントのルータが存在しないので、それを見て判断している)
        // そのため決め打ちで一番最初の下書きを選択する
        // また意図的に状態をリフレッシュしたい時は、ドラフト詳細が表示された状態でも、同様のリフレッシュ処理を行う
        if (!this.route.firstChild || isRefresh) {
          const _id = this.groupedDrafts.notPosted.length > 0
            ? this.groupedDrafts.notPosted[0]._id
            : this.groupedDrafts.posted[0]._id;

          this.router.navigate(['drafts', _id]);
        }
      });
  }

  /**
   * 指定した下書きを投稿済と未投稿に分類する
   *
   * @param drafts 下書きのリスト
   * @returns 投稿済と未投稿に分類した結果
   */
  grouping(drafts: Array<DraftModel>): GroupedDrafts {
    const result: GroupedDrafts = {
      notPosted: [],
      posted: []
    };

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
