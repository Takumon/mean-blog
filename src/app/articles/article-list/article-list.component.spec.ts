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
          count: 201,
          articles: createModels(20)
        };
        return Observable.of(articles);
      }
    );
  }

  function createModels (length: number): ArticleModel[] {
    const models = [];
    let id = 123456789000;
    for (let i = 0; i < length; i++) {
      models.push({
        _id: id.toString(),
        title: `記事タイトル${id}`,
        body: `##記事本文 ¥r¥n これは記事本文のサンプルです。${id}`,
        isMarkdown: true,
        author: '1234580000',
        created: '20150101 12:34:30',
        updated: '20150101 12:34:30'
      });

      id++;
    }

    return models;
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

    describe('初期表示時', () => {
      it('前へが非活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-previous'));
        expect(pagePrevButton.nativeElement.disabled).toBe(true);
      });

      it('次へが活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-next'));
        expect(pagePrevButton.nativeElement.disabled).toBe(false);
      });

      it('ページングラベルは1ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 11ページ目');
      });

      it('ソートボタンの登録日のオーダは降順', () => {
        const createdArrowButton = de.queryAll(By.css('.sort_created'))[0];
        fixture.detectChanges();
        const createdArrowIcon = createdArrowButton.query(By.css('i'));
        expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
      });

      it('ソートボタンの更新日のオーダは未指定', () => {
        const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
        fixture.detectChanges();
        const updatedArrowIcon = updatedSortButton.query(By.css('i'));
        expect(updatedArrowIcon).toBeNull();
      });

      it('登録日の降順で検索される', () => {
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
    });

    describe('前へボタンをクリック時', () => {
      beforeEach(() => {
        const previousPageButton = de.query(By.css('.mat-paginator-navigation-previous'));
        previousPageButton.triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('ページングラベルは1ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 11ページ目');
      });

      it('検索は走らない', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(1);
      });
    });



    describe('次へボタンをクリック時', () => {

      beforeEach(() => {
        const nextPageButton = de.query(By.css('.mat-paginator-navigation-next'));
        nextPageButton.triggerEventHandler('click', null);
        fixture.detectChanges();
      });


      it('前へが活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-previous'));
        expect(pagePrevButton.nativeElement.disabled).toBe(false);
      });

      it('次へが活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-next'));
        expect(pagePrevButton.nativeElement.disabled).toBe(false);
      });

      it('ソートボタンの登録日のオーダは降順', () => {
        const createdArrowButton = de.queryAll(By.css('.sort_created'))[0];
        fixture.detectChanges();
        const createdArrowIcon = createdArrowButton.query(By.css('i'));
        expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
      });

      it('ソートボタンの更新日のオーダは未指定', () => {
        const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
        fixture.detectChanges();
        const updatedArrowIcon = updatedSortButton.query(By.css('i'));
        expect(updatedArrowIcon).toBeNull();
      });

      it('ページングラベルは2ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　2 / 11ページ目');
      });

      it('2ページ目が検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            created: -1,
          },
          skip: 20,
          limit: 20
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });
    });


    describe('次へボタンをクリック時して最終ページを表示した時', () => {
      beforeEach(() => {
        // 11ページ目に遷移
        for (let i = 0; i < 10; i++) {
          const nextPageButton = de.query(By.css('.mat-paginator-navigation-next'));
          nextPageButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        }
      });


      it('前へが活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-previous'));
        expect(pagePrevButton.nativeElement.disabled).toBe(false);
      });

      it('次へが非活性', () => {
        const pagePrevButton = de.query(By.css('.mat-paginator-navigation-next'));
        expect(pagePrevButton.nativeElement.disabled).toBe(true);
      });

      it('ページングラベルは11ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　11 / 11ページ目');
      });

      it('11ページ目が検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(11);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            created: -1,
          },
          skip: 200,
          limit: 1
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });


      describe('次へボタンをクリック時', () => {
        beforeEach(() => {
          const nextPageButton = de.query(By.css('.mat-paginator-navigation-next'));
          nextPageButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('ページングラベルは11ページ目を示している', () => {
          const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
          expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　11 / 11ページ目');
        });

        it('検索は走らない', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(11);
        });
      });


      describe('前へボタンをクリック時', () => {
        beforeEach(() => {
          const previousPageButton = de.query(By.css('.mat-paginator-navigation-previous'));
          previousPageButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('ページングラベルは10ページ目を示している', () => {
          const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
          expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　10 / 11ページ目');
        });

        it('10ページ目が検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(12);
          expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
          expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
            sort: {
              created: -1,
            },
            skip: 180,
            limit: 20
          });
          expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
        });
      });



      describe('１ページあたりの件数を50件にした時', () => {
        beforeEach(() => {
          const pageSelect = de.query(By.css('mat-paginator .mat-select-trigger'));
          pageSelect.triggerEventHandler('click', null);
          fixture.detectChanges();

          // 2番目＝50件を選択
          const count20PerPage = de.queryAll(By.css('mat-option'))[1];
          count20PerPage.triggerEventHandler('click', null);

          fixture.detectChanges();
        });

        it('ページングラベルは1ページ目を示している', () => {
          const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
          expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 5ページ目');
        });

        it('1ページ目が検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(12);
          expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
          expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
            sort: {
              created: -1,
            },
            skip: 0,
            limit: 50
          });
          expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
        });

      });
    });



    describe('１ページあたりの件数を20件にした時', () => {
      beforeEach(() => {
        const pageSelect = de.query(By.css('mat-paginator .mat-select-trigger'));
        pageSelect.triggerEventHandler('click', null);
        fixture.detectChanges();

        // 1番目＝20件を選択
        const count20PerPage = de.queryAll(By.css('mat-option'))[0];
        count20PerPage.triggerEventHandler('click', null);

        fixture.detectChanges();
      });

      it('ページングラベルは1ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 11ページ目');
      });

      it('登録日の降順で検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
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

    });


    describe('１ページあたりの件数を50件にした時', () => {
      beforeEach(() => {
        const pageSelect = de.query(By.css('mat-paginator .mat-select-trigger'));
        pageSelect.triggerEventHandler('click', null);
        fixture.detectChanges();

        // 2番目=50件を選択
        const count20PerPage = de.queryAll(By.css('mat-option'))[1];
        count20PerPage.triggerEventHandler('click', null);

        fixture.detectChanges();
      });

      it('ページングラベルは1ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 5ページ目');
      });

      it('登録日の降順で検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            created: -1,
          },
          skip: 0,
          limit: 50
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });

    });



    describe('１ページあたりの件数を100件にした時', () => {
      beforeEach(() => {
        const pageSelect = de.query(By.css('mat-paginator .mat-select-trigger'));
        pageSelect.triggerEventHandler('click', null);
        fixture.detectChanges();

        // 3番目=100件を選択
        const count20PerPage = de.queryAll(By.css('mat-option'))[2];
        count20PerPage.triggerEventHandler('click', null);

        fixture.detectChanges();
      });

      it('ページングラベルは1ページ目を示している', () => {
        const paginatorRangeLable = de.query(By.css('.mat-paginator-range-label'));
        expect(paginatorRangeLable.nativeElement.textContent).toEqual('201 件　　　1 / 3ページ目');
      });

      it('登録日の降順で検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            created: -1,
          },
          skip: 0,
          limit: 100
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });

    });






    describe('ソートボタン登録日をクリックした時', () => {
      beforeEach(() => {
        const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
        createdSortButton.triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('登録日ボタンが昇順になっている', () => {
        const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
        fixture.detectChanges();
        const createdArrowIcon = createdSortButton.query(By.css('i'));
        expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-up');
      });

      it('更新日ボタンのソートが未指定になっている', () => {
        const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
        fixture.detectChanges();
        const updatedArrowIcon = updatedSortButton.query(By.css('i'));
        expect(updatedArrowIcon).toBeNull();
      });

      it('登録日が昇順で検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            created: 1,
          },
          skip: 0,
          limit: 20
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });

      describe('１ページあたりの件数を50件にした時', () => {
        beforeEach(() => {
          const pageSelect = de.query(By.css('mat-paginator .mat-select-trigger'));
          pageSelect.triggerEventHandler('click', null);
          fixture.detectChanges();

          // 2番目＝50件を選択
          const count20PerPage = de.queryAll(By.css('mat-option'))[1];
          count20PerPage.triggerEventHandler('click', null);

          fixture.detectChanges();
        });


        it('登録日ボタンが昇順になっている', () => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          fixture.detectChanges();
          const createdArrowIcon = createdSortButton.query(By.css('i'));
          expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-up');
        });

        it('更新日ボタンのソートが未指定になっている', () => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          fixture.detectChanges();
          const updatedArrowIcon = updatedSortButton.query(By.css('i'));
          expect(updatedArrowIcon).toBeNull();
        });

        it('登録日が昇順で検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(3);
          expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
          expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
            sort: {
              created: 1,
            },
            skip: 0,
            limit: 50
          });
          expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
        });

      });



      describe('ソートボタン登録日をクリックした時', () => {
        beforeEach(() => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          createdSortButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('登録日ボタンが降順になっている', () => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          fixture.detectChanges();
          const createdArrowIcon = createdSortButton.query(By.css('i'));
          expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
        });

        it('更新日ボタンのソートが未指定になっている', () => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          fixture.detectChanges();
          const updatedArrowIcon = updatedSortButton.query(By.css('i'));
          expect(updatedArrowIcon).toBeNull();
        });

        it('登録日が降順で検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(3);
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

      });



      describe('ソートボタン更新日をクリックした時', () => {
        beforeEach(() => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          updatedSortButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('登録日ボタンのソートが未指定なっている', () => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          fixture.detectChanges();
          const createdArrowIcon = createdSortButton.query(By.css('i'));
          expect(createdArrowIcon).toBeNull();
        });

        it('更新日ボタンのソートが降順になっている', () => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          fixture.detectChanges();
          const updatedArrowIcon = updatedSortButton.query(By.css('i'));
          expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
        });

        it('更新日が昇順で検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(3);
          expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
          expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
            sort: {
              updated: -1,
            },
            skip: 0,
            limit: 20
          });
          expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
        });
      });

    });



    describe('ソートボタン更新日をクリックした時', () => {
      beforeEach(() => {
        const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
        updatedSortButton.triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('登録日ボタンのソートが未指定なっている', () => {
        const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
        fixture.detectChanges();
        const createdArrowIcon = createdSortButton.query(By.css('i'));
        expect(createdArrowIcon).toBeNull();
      });

      it('更新日ボタンのソートが降順になっている', () => {
        const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
        fixture.detectChanges();
        const updatedArrowIcon = updatedSortButton.query(By.css('i'));
        expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
      });

      it('更新日が降順で検索される', () => {
        expect(articleServiceSpy.get.calls.count()).toBe(2);
        expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
        expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
          sort: {
            updated: -1,
          },
          skip: 0,
          limit: 20
        });
        expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
      });



      describe('ソートボタン更新日をクリックした時', () => {
        beforeEach(() => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          updatedSortButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('登録日ボタンのソートが未指定なっている', () => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          fixture.detectChanges();
          const createdArrowIcon = createdSortButton.query(By.css('i'));
          expect(createdArrowIcon).toBeNull();
        });

        it('更新日ボタンのソートが降順になっている', () => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          fixture.detectChanges();
          const updatedArrowIcon = updatedSortButton.query(By.css('i'));
          expect(updatedArrowIcon.nativeElement.classList).toContain('fa-long-arrow-up');
        });

        it('更新日が昇順で検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(3);
          expect(articleServiceSpy.get.calls.mostRecent().args[0]).toEqual({});
          expect(articleServiceSpy.get.calls.mostRecent().args[1]).toEqual({
            sort: {
              updated: 1,
            },
            skip: 0,
            limit: 20
          });
          expect(articleServiceSpy.get.calls.mostRecent().args[2]).toEqual(true);
        });
      });


      describe('ソートボタン登録日をクリックした時', () => {
        beforeEach(() => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          createdSortButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('登録日ボタンが降順になっている', () => {
          const createdSortButton = de.queryAll(By.css('.sort_created'))[0];
          fixture.detectChanges();
          const createdArrowIcon = createdSortButton.query(By.css('i'));
          expect(createdArrowIcon.nativeElement.classList).toContain('fa-long-arrow-down');
        });

        it('更新日ボタンのソートが未指定になっている', () => {
          const updatedSortButton = de.queryAll(By.css('.sort_updated'))[0];
          fixture.detectChanges();
          const updatedArrowIcon = updatedSortButton.query(By.css('i'));
          expect(updatedArrowIcon).toBeNull();
        });

        it('登録日が降順で検索される', () => {
          expect(articleServiceSpy.get.calls.count()).toBe(3);
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
      });

    });

  });
});
