import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import marked from 'marked';



import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MatSnackBar, MatDialog, ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { MarkdownParsePipe } from '../shared/markdown-parse.pipe';
import { OrderByPipe } from '../shared/orderby.pipe';
import { ExcludeDeletedCommentPipe } from '../shared/exclude-deleted-comment.pipe';
import { ExcludeDeletedVoterPipe } from '../shared/exclude-deleted-voter.pipe';
import { SafeHtmlPipe } from '../shared/safe-html.pipe';


import { Constant } from '../../shared/constant';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { MessageService } from '../../shared/services/message.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';


import { ArticleDetailComponent } from './article-detail.component';
import { MarkdownParseService } from '../shared/markdown-parse.service';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleModel } from '../shared/article.model';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';

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

  class MockActivatedRoute {
    params: Observable<Object> = Observable.of({
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
      return Observable.of(model);
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

        MarkdownParsePipe,
        OrderByPipe,
        ExcludeDeletedCommentPipe,
        ExcludeDeletedVoterPipe,
        SafeHtmlPipe,
      ],
      imports: [
        SharedModule,
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
        RouteNamesService,
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
