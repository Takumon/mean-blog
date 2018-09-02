import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ScrollSpyInfo, ScrollSpyService } from './scroll-spy.service';


export interface TocItem {
  level: string;
  title: string;
}

// 現在表示されている領域が何番目タイトルに属するか監視するサービス
@Injectable()
export class TocService {
  // 目次リスト
  tocList = new ReplaySubject<TocItem[]>(1);
  // 現在表示されている領域が何番目のタイトルに属するか
  activeItemIndex = new ReplaySubject<number | null>(1);
  private scrollSpyInfo: ScrollSpyInfo | null;

  constructor(
      private scrollSpyService: ScrollSpyService
  ) {
  }

  genToc(headings: HTMLHeadingElement[], docId = '') {
    this.resetScrollSpyInfo();

    const tocList = headings.map(heading => ({
      level: heading.tagName.toLowerCase(),
      title: heading.textContent.trim(),
    }));

    this.tocList.next(tocList);

    // TODO ヘッダの高さ分を考慮したい
    this.scrollSpyInfo = this.scrollSpyService.spyOn(headings);
    this.scrollSpyInfo.active.subscribe(item => this.activeItemIndex.next(item && item.index));
  }

  reset() {
    this.resetScrollSpyInfo();
    this.tocList.next([]);
  }

  private resetScrollSpyInfo() {
    if (this.scrollSpyInfo) {
      this.scrollSpyInfo.unspy();
      this.scrollSpyInfo = null;
    }

    this.activeItemIndex.next(null);
  }
}
