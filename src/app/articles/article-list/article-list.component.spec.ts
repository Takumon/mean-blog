import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ActivatedRoute, Data } from '@angular/router';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MatSnackBar, ErrorStateMatcher, MatPaginatorIntl } from '@angular/material';

import { SharedModule } from '../../shared/shared.module';

import { ErrorStateMatcherContainParentGroup } from '../../shared/services/message.service';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import { Constant } from '../../shared/constant';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { MessageService } from '../../shared/services/message.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';

import { ArticleListComponent } from './article-list.component';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ScrollService } from '../../shared/services/scroll.service';
import { PaginatorService } from '../../shared/services/paginator.service';
import { UserService } from '../../users/shared/user.service';
import { ArticleModel } from '../shared/article.model';

describe('ArticleListComponent', () => {

  @Component({
    selector: 'app-article',
    template: `
    <div>
      <h4>{{item.title}}</h4>
      <p>{{item.body}}</p>
    </div>
    `
  })
  class MockArticleComponent {
    @Input() item: ArticleWithUserModel;
  }

  @Component({
    selector: 'app-search-condition',
    template: '<p>Mock Serch Condition</p>'
  })
  class MockSearchConditionComponent {
    @Output() changeSeaerchCondition = new EventEmitter();
  }

  class MockAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    checkState(): Observable<any> {
      return Observable.of('token');
    }
    logout() {
      console.log('logout');
    }
    isLogin(): boolean {
      return true;
    }

    isAdmin(): boolean {
      return false;
    }
    getToken(): String {
      return 'token';
    }

    hasToken(): boolean {
      return true;
    }
  }

  class MockArticleService {
    get = jasmine.createSpy('getHero').and.callFake(
      (conditin, pageingOption, withUser) => {

        const articles: {count: number, articles: ArticleModel[] } = {
          count: 4,
          articles: [
            {
              _id: '123456789011',
              title: '記事タイトル1',
              body: '##記事本文 ¥r¥n これは記事本文のサンプルです。',
              isMarkdown: true,
              author: '1234589022',
              created: '20150101 12:34:30',
              updated: '20150101 12:34:30'
            },
            {
              _id: '123456789012',
              title: '記事タイトル2',
              body: '##記事本文 ¥r¥n これは記事本文のサンプルです。',
              isMarkdown: true,
              author: '1234589022',
              created: '20150101 12:34:30',
              updated: '20150101 12:34:30'
            },
            {
              _id: '123456789013',
              title: '記事タイトル3',
              body: '##記事本文 ¥r¥n これは記事本文のサンプルです。',
              isMarkdown: true,
              author: '1234589022',
              created: '20150101 12:34:30',
              updated: '20150101 12:34:30'
            },
            {
              _id: '123456789014',
              title: '記事タイトル4',
              body: '##記事本文 ¥r¥n これは記事本文のサンプルです。',
              isMarkdown: true,
              author: '1234589022',
              created: '20150101 12:34:30',
              updated: '20150101 12:34:30'
            }
          ]
        };
        return Observable.of(articles);
      }
    );
  }

  class MockUserService {

  }

  let comp: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let de: DebugElement;

  let articleServiceSpy: any;


  describe('モードが全件表示の場合', () => {
    beforeEach(async() => {

      TestBed.configureTestingModule({
        declarations: [
          ArticleListComponent,
          MockArticleComponent,
          MockSearchConditionComponent,
        ],
        imports: [
          RouterTestingModule,
          SharedModule,
        ],
        providers: [
          {
            provide: MatPaginatorIntl,
            useClass: PaginatorService
          },
          ErrorStateMatcherContainParentGroup,
          {
            provide: ErrorStateMatcher,
            useClass: CustomErrorStateMatcher
          },
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ArticleService, useClass: MockArticleService },
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: UserService, useClass: MockUserService },
          {
            provide: ActivatedRoute,
            useValue: {
              data: Observable.of({mode: 100})
            }
          },
          ScrollService,
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ArticleListComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      articleServiceSpy = de.injector.get(ArticleService) as any;

      fixture.detectChanges();
    });

    it('初期表示時 ページ数は1、件数は4で表示される', () => {
      const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
      expect(paginatorRangeLable.nativeElement.textContent).toEqual('4 件　　　1 / 1ページ目');
    });

    it('初期表示時 登録日の降順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];

      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon).toBeNull();

      expect(articleServiceSpy.get.calls.count()).toBe(1);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          created: -1,
        },
        skip: 0,
        limit: 20
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('登録日を1回クリックした時 登録日の昇順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
      createdSortButton.triggerEventHandler('click', null);

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];

      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-up');

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon).toBeNull();


      expect(articleServiceSpy.get.calls.count()).toBe(2);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          created: 1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('登録日を1回クリックして更新日を1回クリックした時 更新日の降順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
      createdSortButton.triggerEventHandler('click', null);

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
      updatedSortButton.triggerEventHandler('click', null);

      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon).toBeNull();

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');

      expect(articleServiceSpy.get.calls.count()).toBe(3);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          updated: -1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('登録日を2回クリックした時 登録日の降順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
      createdSortButton.triggerEventHandler('click', null);
      createdSortButton.triggerEventHandler('click', null);

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];

      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon).toBeNull();

      expect(articleServiceSpy.get.calls.count()).toBe(3);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          created: -1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('更新日を1回クリックした時 更新日の降順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
      updatedSortButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon).toBeNull();

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');

      expect(articleServiceSpy.get.calls.count()).toBe(2);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          updated: -1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('更新日を1回クリックして登録日を1回クリックした時 登録日の降順でソートされる', () => {

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
      updatedSortButton.triggerEventHandler('click', null);

      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
      createdSortButton.triggerEventHandler('click', null);

      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon).toBeNull();

      expect(articleServiceSpy.get.calls.count()).toBe(3);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          created: -1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

    it('更新日を2回クリックした時 更新日の昇順でソートされる', () => {
      const createdSortButton = de.queryAll(By.css('.sort_created'))[0];

      const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
      updatedSortButton.triggerEventHandler('click', null);
      updatedSortButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const createdArrowIcon = createdSortButton.query(By.css('i'));
      expect(createdArrowIcon).toBeNull();

      const updatedArrowIcon = updatedSortButton.query(By.css('i'));
      expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-up');

      expect(articleServiceSpy.get.calls.count()).toBe(3);
      expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
      expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
        sort: {
          updated: 1,
        },
        skip: 0,
        limit: 4
      });
      expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
    });

  });
});
