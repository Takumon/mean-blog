import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import marked from 'marked';

import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommentModel } from '../shared/comment.model';
import { UserModel } from '../../users/shared/user.model';
import { CommentWithUserModel } from '../shared/comment-with-user.model';
import { ArticleComponent } from './article.component';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { ErrorStateMatcherContainParentGroup, MessageService } from '../../shared/services/message.service';
import { ErrorStateMatcher } from '@angular/material';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MarkdownParsePipe } from '../shared/markdown-parse.pipe';
import { MarkdownParseService } from '../shared/markdown-parse.service';
import { ExcludeDeletedCommentPipe } from '../shared/exclude-deleted-comment.pipe';
import { ExcludeDeletedVoterPipe } from '../shared/exclude-deleted-voter.pipe';
import { APP_BASE_HREF } from '@angular/common';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { CommentService } from '../shared/comment.service';
import { ArticleModel } from '../shared/article.model';
import { VoteCudResponse, ArticleService } from '../shared/article.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core/src/metadata/ng_module';

describe('ArticleComponent', () => {

  @Component({
    selector: 'app-test-cmp',
    template: '<div style="margin:10px"><app-article class="test-wrapper" [item]="item"></app-article></div>',
  })
  class TestCmpWrapperComponent {
      item = {
        _id: '12345678912',
        title: 'サンプルタイトル',
        body: `## セッションタイトル
* リスト1
* リスト2`,
        isMarkdown: true,
        author: {
          _id: '123456789088',
          userId: 'testAuthorUserId1',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        },
        vote: [{
          _id: '123456789077',
          userId: 'testAuthorUserId2',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        },
        {
          _id: '123456789066',
          userId: 'testAuthorUserId3',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
        comments: [{
          _id: '123456789022',
          articleId: '12345678912',
          text: 'サンプルコメント',
          user: {
            _id: '123456789077',
            userId: 'testAuthorUserId2',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          },
          replies: [{
            _id: '123456789044',
            articleId: '12345678912',
            test: 'サンプルリプライ',
            user: {
              _id: '123456789077',
              userId: 'testAuthorUserId2',
              isAdmin: false,
              created: '2018-02-11T23:39:37.263Z',
              updated: '2018-02-11T23:39:37.263Z'
            },
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z',
            commentId: '123456789022'
          }],
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        },
        {
          _id: '123456789023',
          articleId: '12345678913',
          text: 'サンプルコメント2',
          user: {
            _id: '123456789077',
            userId: 'testAuthorUserId2',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          },
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
        created: '2018-02-11T23:39:37.263Z',
        updated: '2018-02-11T23:39:37.263Z'
      };
  }


  // <app-comment-form
  // [model]="item.newComment"
  // [hasCancelBtn]="true"
  // [isAuthfocuse]="true"
  // (complete)="refreshComments()"
  // (cancel)="cancelNewComment()"></app-comment-form>
  @Component({
    selector: 'app-comment-form',
    template: `
    <div style="border: 1px solid black">
      <div>コメント編集</div>
      <div>{{model.text}}</div>
    </div>
    `
  })
  class MockCommentFormComponent {
    @Input() hasCancelBtn: boolean;
    @Input() isAuthfocuse: boolean;
    @Input() model: CommentModel;

    @Output() complete = new EventEmitter();

    /** キャンセル時に発行するイベント */
    @Output() cancel = new EventEmitter();
  }


  //   <app-voter-list
  //   [voters]="item.vote"
  // ></app-voter-list>
  @Component({
    selector: 'app-voter-list',
    template: `
      <div style="border: 1px solid black" *ngFor="let voter of voters">いいね {{voter.userId}}<div>
    `
  })
  class MockVoterListComponent {
    @Input() voters: UserModel[];
  }

  //   <app-comment-list
  //   _idOfArticle="{{item._id}}"
  //   [comments]="item.comments"
  //   (refresh)="refreshComments()"
  // ></app-comment-list>
  @Component({
    selector: 'app-comment-list',
    template: `
      <div style="border: 1px solid black" *ngFor="let comment of comments">
        {{comment.user.userId}}さんのコメント<br>
        {{comment.text}}
      <div>
    `
  })
  class MockCommentListComponent {
    @Input() replyCommentIndentMargin: Number = 42;
    @Input() replyCommentIndentLimit: Number = 4;
    @Input() _idOfArticle: string;
    @Input() comments: CommentWithUserModel[];
    @Output() refresh = new EventEmitter();
  }

  class MockAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    isLogin(): boolean {
      return true;
    }
  }

  class MockNoAuthenticationService {
    loginUser = new UserModel();
    isFinishedCheckState = true;

    isLogin(): boolean {
      return false;
    }
  }

  class MockCommentService {
    count(comments: CommentWithUserModel[]): number {
      if (!comments || comments.length === 0) {
        return 0;
      }
      let commentCount =  comments.length;
      for (const c of comments) {
        if (c.replies) {
          commentCount += c.replies.length;
        }
      }
      return commentCount;
    }
  }

  class MockArticleService {
    getVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string) => {
        return Observable.of([{
          _id: '123456789012',
          userId: 'sampleUserId',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }]);
      }
    );

    registerVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string, voterId: string) => {
        const article: VoteCudResponse = {
          message: 'いいねを登録しました。',
          obj: ['1234580000'],
        };
        return Observable.of(article);
      }
    );

    deleteVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string, voterId: string) => {
        const article: VoteCudResponse = {
          message: 'いいねを削除しました。',
          obj: ['1234580000'],
        };
        return Observable.of(article);
      }
    );
  }

  let comp: TestCmpWrapperComponent;
  let fixture: ComponentFixture<TestCmpWrapperComponent>;
  let de: DebugElement;

  describe('認証時 初期表示', () => {
    beforeEach( () => {
      TestBed.configureTestingModule({
        declarations: [
          TestCmpWrapperComponent,
          ArticleComponent,
          MockCommentFormComponent,
          MockCommentListComponent,
          MockVoterListComponent,
          MarkdownParsePipe,
          ExcludeDeletedCommentPipe,
          ExcludeDeletedVoterPipe,
        ],
        imports: [
          SharedModule
        ],
        providers: [
          MessageService,
          MessageBarService,
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: CommentService, useClass: MockCommentService },
          { provide: ArticleService, useClass: MockArticleService },
          { provide: APP_BASE_HREF, useValue: '/' },
          MarkdownParseService,
          { provide: ComponentFixtureAutoDetect, useValue: true },
          ErrorStateMatcherContainParentGroup,
          {
            provide: ErrorStateMatcher,
            useClass: CustomErrorStateMatcher
          },
        ]
      });

      fixture = TestBed.createComponent(TestCmpWrapperComponent);
      comp = fixture.componentInstance;

      de = fixture.debugElement;
      fixture.detectChanges();
    });

    it('初期表示時', () => {
      expect(true).toBeTruthy();
      const authorName = de.query(By.css('.article__author-name')).nativeElement.textContent;
      expect(authorName).toEqual('testAuthorUserId1');

      const date = de.query(By.css('.article__date')).nativeElement.textContent;
      expect(date).toContain('2018/02/12 08:39');

      const title = de.query(By.css('.article__title')).nativeElement.textContent;
      expect(title).toContain('サンプルタイトル');
    });

    it('markdown形式で記事が表示される', () => {
      const title = de.query(By.css('.markdown-body'));
      expect(title).not.toBeNull();
    });

    it('いいねボタンが表示される', () => {
      const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
      expect(voteBtn).not.toBeNull();
      expect(voteBtn.nativeElement.textContent).toContain('いいね!');
    });

    it('コメントボタンが表示される', () => {
      const commentBtn = de.queryAll(By.css('.article__operation-btn'))[1];
      expect(commentBtn).not.toBeNull();
      expect(commentBtn.nativeElement.textContent).toContain('コメントする');
    });

    it('いいね数が表示される', () => {
      const countVote = de.query(By.css('.comments__count_vote'));
      expect(countVote).not.toBeNull();
      expect(countVote.nativeElement.textContent).toContain('2人');
    });


    it('コメント数がリプライも含めて表示される', () => {
      const countComment = de.query(By.css('.comments__count'));
      expect(countComment).not.toBeNull();
      expect(countComment.nativeElement.textContent).toContain('3件');
    });
  });

});
