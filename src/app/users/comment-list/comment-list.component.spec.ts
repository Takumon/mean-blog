import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { Constant } from '../../shared/constant';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';

import { CommentListComponent } from './comment-list.component';
import { ArticleWithUserModel } from '../../articles/shared/article-with-user.model';
import { CommentService } from '../../articles/shared/comment.service';
import { CommentModel } from '../../articles/shared/comment.model';
import { CommentWithUserModel } from '../../articles/shared/comment-with-user.model';
import { CommentWithArticleModel } from '../../articles/shared/comment-with-article.model';
import { ReplyService } from '../../articles/shared/reply.service';
import { ReplyModel } from '../../articles/shared/reply.model';
import { ReplyWithUserModel } from '../../articles/shared/reply-with-user.model';
import { ReplyWithArticleModel } from '../../articles/shared/reply-with-article.model';
import { UserService } from '../shared/user.service';


describe('CommentListComponent', () => {

  class MockAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    checkState(): Observable<any> {
      return Observable.of('token');
    }
    login() {
      return Observable.of({key: 'value'});
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
      return Observable.of(replies);
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
      return Observable.of(comments);
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

      return Observable.of(model);
    }
  }

  class MockActivatedRoute {
    parent = {
      params: Observable.of({
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
