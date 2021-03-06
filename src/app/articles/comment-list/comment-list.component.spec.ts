import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import 'rxjs';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBar, MatDialog } from '@angular/material';

import { SharedModule } from '../../shared/shared.module';
import {
  AuthenticationService,
  ArticleService,
} from '../../shared/services';
import {
  UserModel,
  CommentModel,
  CommentWithUserModel,
  ReplyModel,
} from '../../shared/models';


import { CommentService } from '../shared/comment.service';
import { ReplyService } from '../shared/reply.service';

import { CommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {

  @Component({
    selector: 'app-reply-form',
    template: '<p>Mock Reply Form Component</p>'
  })
  class MockReplyFormComponent {
    @Input() model: ReplyModel;
    @Input() hasCancelBtn = true;
    @Input() isAuthfocuse = false;
  }

  @Component({
    selector: 'app-comment-form',
    template: '<p>Mock Comment Form Component</p>'
  })
  class MockCommentFormComponent {
    @Input() model: CommentModel;
    @Input() hasCancelBtn = true;
    @Input() isAuthfocuse = false;
  }


  class MockAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    checkState(): Observable<any> {
      return of('token');
    }
    login() {
      return of({key: 'value'});
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

  }

  class MockReplyService {

  }

  class MockCommentService {
    getOfArticle(_idOfArticle: string, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel>> {

      const comments = [
        {
          _id: '123456789012',
          articleId: '123456789022',
          text: 'コメント本文その１',
          user: {
            _id: '123456789099',
            userId: 'testUserId1',
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
            isAdmin: false
          },
          created: '2017/11/28 15:30',
          updated: '2017/11/28 15:30'
        },
        {
          _id: '123456789013',
          articleId: '123456789022',
          text: 'コメント本文その２',
          user: {
            _id: '123456789088',
            userId: 'testUserId2',
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
            isAdmin: false
          },
          created: '2017/11/28 15:40',
          updated: '2017/11/28 15:40'
        }
      ];
      return of(comments);
    }

    count() {
      return 2;
    }
  }

  let comp: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        CommentListComponent,

        MockReplyFormComponent,
        MockCommentFormComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ArticleService, useClass: MockArticleService },
        { provide: CommentService, useClass: MockCommentService },
        { provide: ReplyService, useClass: MockReplyService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        MatSnackBar,
        MatDialog,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    comp = fixture.componentInstance;
    comp._idOfArticle = '123456789012';
    de = fixture.debugElement;
  });


  it('オブジェクトが生成されるべき', () => {
    fixture.detectChanges();

    expect(comp).toBeTruthy();
  });
});
