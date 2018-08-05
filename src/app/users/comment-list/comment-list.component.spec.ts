import { Observable, of } from 'rxjs';
import 'rxjs';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AuthenticationService } from '../../shared/services/authentication.service';
import {
  UserModel,
  CommentModel,
  CommentWithUserModel,
  CommentWithArticleModel,
  ReplyModel,
  ReplyWithUserModel,
  ReplyWithArticleModel,
} from '../../shared/models';

import { CommentListComponent } from './comment-list.component';
import { CommentService } from '../../articles/shared/comment.service';
import { UserService } from '../../shared/services/user.service';
import { ReplyService } from '../../articles/shared/reply.service';


describe('CommentListComponent', () => {

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

  class MockReplyService {
    get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<ReplyModel> | Array<ReplyWithUserModel> | Array<ReplyWithArticleModel>> {
      const replies: Array<ReplyWithArticleModel> = [
        {
          _id: '123456789013',
          articleId: {
            _id: '123456789022',
            title: 'テスト記事のタイトル',
            body: 'テスト記事の本文',
            isMarkdown: false,
            author: {
              _id: '123456789099',
              userId: 'testUserId1',
              created: '2017/11/28 15:30',
              updated: '2017/11/28 15:30',
              isAdmin: false
            },
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
          },
          text: 'リプライ本文その１',
          user: {
            _id: '123456789099',
            userId: 'testUserId1',
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
            isAdmin: false
          },
          created: '2017/11/28 15:30',
          updated: '2017/11/28 15:30',
          commentId: '123456789022',
        },
        {
          _id: '123456789014',
          articleId: {
            _id: '123456789022',
            title: 'テスト記事のタイトル',
            body: 'テスト記事の本文',
            isMarkdown: false,
            author: {
              _id: '123456789099',
              userId: 'testUserId1',
              created: '2017/11/28 15:30',
              updated: '2017/11/28 15:30',
              isAdmin: false
            },
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
          },
          text: 'リプライ本文その2',
          user: {
            _id: '123456789099',
            userId: 'testUserId1',
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
            isAdmin: false
          },
          created: '2017/11/28 15:30',
          updated: '2017/11/28 15:30',
          commentId: '123456789033',
        },
      ];
      return of(replies);
    }
  }

  class MockCommentService {
    get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>> {
      const comments: Array<CommentWithArticleModel> = [
        {
          _id: '123456789012',
          articleId: {
            _id: '123456789022',
            title: 'テスト記事のタイトル',
            body: 'テスト記事の本文',
            isMarkdown: false,
            author: {
              _id: '123456789099',
              userId: 'testUserId1',
              created: '2017/11/28 15:30',
              updated: '2017/11/28 15:30',
              isAdmin: false
            },
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
          },
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
          articleId: {
            _id: '123456789022',
            title: 'テスト記事のタイトル',
            body: 'テスト記事の本文',
            isMarkdown: false,
            author: {
              _id: '123456789099',
              userId: 'testUserId1',
              created: '2017/11/28 15:30',
              updated: '2017/11/28 15:30',
              isAdmin: false
            },
            created: '2017/11/28 15:30',
            updated: '2017/11/28 15:30',
          },
          text: 'コメント本文その2',
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
      ];
      return of(comments);
    }
  }

  class MockUserService {
    getById(userId: string): Observable<UserModel> {
      const model: UserModel = {
        _id: '123456789012',
        userId: 'testUser1',
        isAdmin: false,
        created: '2017/11/28 15:40',
        updated: '2017/11/28 15:40'
      };

      return of(model);
    }
  }

  class MockActivatedRoute {
    parent = {
      params: of({
        _userId: 'testUser1',
      })
    };
  }


  let comp: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        CommentListComponent,
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: CommentService, useClass: MockCommentService },
        { provide: ReplyService, useClass: MockReplyService },
        { provide: UserService, useClass: MockUserService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });


  it('オブジェクトが生成されるべき', () => {
    fixture.detectChanges();

    expect(comp).toBeTruthy();
  });
});
