import { Observable, of } from 'rxjs';
import 'rxjs';
import marked from 'marked';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from '../../state';

import { SharedModule } from '../../shared/shared.module';
import {
  MarkdownParseService,
  MessageBarService,
  AuthenticationService,
  ArticleService,
} from '../../shared/services';
import {
  UserModel,
  ArticleWithUserModel,
  ArticleModel,
} from '../../shared/models';


import { ArticleDetailComponent } from './article-detail.component';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

describe('ArticleDetailComponent', () => {

  @Component({
    selector: 'app-article-toc',
    template: '<p>Mock Article Toc Component</p>'
  })
  class MockArticleTocComponent {
    @Input() toc: string;
    @Input() title: string;
    @Input() baseUrl: string;
  }

  @Component({
    selector: 'app-comment-list',
    template: '<p>Mock Comment List Component</p>'
  })
  class MockCommentListComponent {
    @Input() _idOfArticle: string;
  }

  class MockAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    checkState(): Observable<any> {
      return of('token');
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

  class MockActivatedRoute {
    params: Observable<Object> = of({
      _id: '123456789099',
      userId: 'testUserId',
    });
  }

  class MockArticleService {
    getById(_id: string, withUser: Boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
      const model: ArticleWithUserModel = {
        _id: '123456789012',
        title: 'サンプルタイトル',
        body: 'サンプルボディ',
        isMarkdown: false,
        created: '2017/11/28 15:30',
        updated: '2017/11/28 15:30',
        author: {
          _id: '123456789099',
          userId: 'testUserId',
          created: '2017/11/28 15:30',
          updated: '2017/11/28 15:30',
          isAdmin: false
        },
      };
      return of(model);
    }
  }

  class MockMarkdownParseService {
    parse(rawText: string, baseUrl: string = null): any {
      return { text: rawText, toc: [] };
    }
  }

  let comp: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  let de: DebugElement;

  beforeEach(async() => {

    TestBed.configureTestingModule({
      declarations: [
        ArticleDetailComponent,
        MockCommentListComponent,
        MockArticleTocComponent,
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
        })
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ArticleService, useClass: MockArticleService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MarkdownParseService, useClass: MockMarkdownParseService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        MatSnackBar,
        MatDialog,
        MessageBarService,
        provideMockActions(() => of()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });


  it('オブジェクトが生成されるべき', () => {
    fixture.detectChanges();

    expect(comp).toBeTruthy();
  });
});
