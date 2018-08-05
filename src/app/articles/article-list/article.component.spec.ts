import { of, Subscriber, Subject } from 'rxjs';
import 'rxjs';
import marked from 'marked';

import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, inject } from '@angular/core/testing';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

import { SharedModule } from '../../shared/shared.module';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import {
  ErrorStateMatcherContainParentGroup,
  MessageService
} from '../../shared/services/message.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MarkdownParseService } from '../../shared/services/markdown-parse.service';
import { MessageBarService } from '../../shared/services/message-bar.service';
import {
  ExcludeDeletedVoterPipe,
  ExcludeDeletedCommentPipe,
} from '../../shared/pipes';
import {
  ArticleWithUserModel,
  CommentModel,
  CommentWithUserModel,
  UserModel,
} from '../../shared/models';

import { ArticleComponent } from './article.component';
import { VoteCudResponse, ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';

describe('ArticleComponent', () => {

  @Component({
    selector: 'app-test-cmp',
    template: '<div style="margin:10px"><app-article class="test-wrapper" [item]="item"></app-article></div>',
  })
  class TestCmpWrapperComponent {
      item: ArticleWithUserModel = {
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
          _id: '123456789012',
          userId: 'sampleUserId',
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
            text: 'サンプルリプライ',
            user: {
              _id: '123456789078',
              userId: 'testAuthorUserId3',
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
            _id: '123456789079',
            userId: 'testAuthorUserId3',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          },
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
        created: '2018-02-11T23:30:00.000Z',
        updated: '2018-02-11T23:40:00.000Z'
      };
  }


  // いいねがないの場合
  @Component({
    selector: 'app-test-cmp',
    template: '<div style="margin:10px"><app-article class="test-wrapper" [item]="item"></app-article></div>',
  })
  class NoVoteTestCmpWrapperComponent {
      item: ArticleWithUserModel = {
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
            text: 'サンプルリプライ',
            user: {
              _id: '123456789078',
              userId: 'testAuthorUserId3',
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
            _id: '123456789079',
            userId: 'testAuthorUserId3',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          },
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
        created: '2018-02-11T23:30:00.000Z',
        updated: '2018-02-11T23:40:00.000Z'
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
      <div id="mock-component-form-component-cancel" (click)="doCancel()">キャンセル</div>
      <div id="mock-component-form-component-comment" (click)="doComment()">コメント</div>
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

    doCancel() {
      this.cancel.emit();
    }

    doComment() {
      this.complete.emit();
    }
  }


  //   <app-voter-list
  //   [voters]="item.vote"
  // ></app-voter-list>
  @Component({
    selector: 'app-voter-list',
    template: `
      <div class="vote-mock-for-test" style="border: 1px solid black" *ngFor="let voter of voters">いいね {{voter.userId}}<div>
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
        <div class="comment-mock-for-test">
          {{comment.user.userId}}さんのコメント<br>
          {{comment.text}}
        </div>
        <div *ngIf="comment.replies && comment.replies.length > 0">
          <div class="reply-mock-for-test" *ngFor="let rep of comment.replies">
            {{rep.user.userId}}さんのリプライ<br>
            {{rep.text}}
          </div>
        </div>
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
    loginUser: UserModel;
    isFinishedCheckState = true;

    constructor() {
      const loginUser = new UserModel();
      loginUser._id = '123456789055';
      loginUser.isAdmin = false;
      loginUser.userId = 'SampleLoginUserId';
      loginUser.userName = 'SampleLoginUserName';
      this.loginUser = loginUser;
    }

    isLogin(): boolean {
      return true;
    }
  }


  class MockNotLoginAuthenticationService {
    loginUser: UserModel;
    isFinishedCheckState = true;

    constructor() {
      const loginUser = new UserModel();
      loginUser._id = '123456789055';
      loginUser.isAdmin = false;
      loginUser.userId = 'SampleLoginUserId';
      loginUser.userName = 'SampleLoginUserName';
      this.loginUser = loginUser;
    }

    isLogin(): boolean {
      return false;
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

    getOfArticle = jasmine.createSpy('getHero').and.callFake(
      (_id, withUser) =>  {
        const comments  = [{
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
            text: 'サンプルリプライ',
            user: {
              _id: '123456789078',
              userId: 'testAuthorUserId3',
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
            _id: '123456789079',
            userId: 'testAuthorUserId3',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          },
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }];

        return of(comments);
      });

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
    private isRegistered = false;

    getVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string) => {
        const voters: UserModel[] = [];

        voters.push({
          _id: '123456789012',
          userId: 'sampleUserId',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        });

        if (this.isRegistered) {
          voters.push({
            _id: '123456789055',
            userId: 'SampleLoginUserId',
            isAdmin: false,
            created: '2018-02-11T23:39:37.263Z',
            updated: '2018-02-11T23:39:37.263Z'
          });
        }

        return of(voters);
      }
    );

    registerVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string, voterId: string) => {
        this.isRegistered = true;
        const article: VoteCudResponse = {
          message: '記事にいいねしました。',
          obj: ['1234580000'],
        };
        return of(article);
      }
    );

    deleteVote = jasmine.createSpy('getHero').and.callFake(
      (articleId: string, voterId: string) => {
        this.isRegistered = false;
        const article: VoteCudResponse = {
          message: 'いいねを取り消しました。',
          obj: ['1234580000'],
        };
        return of(article);
      }
    );
  }


  class MokMatDialog {

    emitter = new Subject<boolean>();

    open() {
      return {
        afterClosed: () => this.emitter
      };
    }

    cansel() {
      this.emitter.next(false);
    }
    ok() {
      this.emitter.next(true);
    }
  }



  let comp: TestCmpWrapperComponent;
  let fixture: ComponentFixture<TestCmpWrapperComponent>;
  let de: DebugElement;
  let dialog: MokMatDialog;

  describe('認証時', () => {
    beforeEach( () => {
      TestBed.configureTestingModule({
        declarations: [
          TestCmpWrapperComponent,
          ArticleComponent,
          MockCommentFormComponent,
          MockCommentListComponent,
          MockVoterListComponent,
          ExcludeDeletedCommentPipe,
          ExcludeDeletedVoterPipe,
        ],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          SharedModule
        ],
        providers: [
          MessageService,
          MessageBarService,
          { provide: MatDialog, useClass: MokMatDialog },
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: CommentService, useClass: MockCommentService },
          { provide: ArticleService, useClass: MockArticleService },
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ComponentFixtureAutoDetect, useValue: true },
          MarkdownParseService,
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
      dialog = TestBed.get(MatDialog);
    });

    it('ヘッダーバーにユーザ名が表示される', () => {
      const authorName = de.query(By.css('.article__author-name')).nativeElement.textContent;
      expect(authorName).toEqual('testAuthorUserId1');
    });

    it('ヘッダーバーにタイトルが表示される', () => {
      const title = de.query(By.css('.article__title')).nativeElement.textContent;
      expect(title).toContain('サンプルタイトル');
    });

    // TODO 日付は環境依存があるため ローカルとCI環境で同時に成功させることができない
    xit('ヘッダーバーに更新日が表示される', () => {
      const date = de.query(By.css('.article__date')).nativeElement.textContent;
      expect(date).toContain('2018/02/12 23:40');
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
      expect(countVote.nativeElement.textContent).toContain('1人');
    });


    it('コメント数がリプライも含めて表示される', () => {
      const countComment = de.query(By.css('.comments__count'));
      expect(countComment).not.toBeNull();
      expect(countComment.nativeElement.textContent).toContain('3件');
    });

    describe('いいねクリック時', () => {
      let overlayContainer: OverlayContainer;
      let overlayContainerElement: HTMLElement;
      let articleServiceSpy: any;

      beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();

        articleServiceSpy = de.injector.get(ArticleService);

        const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
        voteBtn.triggerEventHandler('click', null);
        fixture.detectChanges();
      }));

      it('いいねが登録される', () => {
        expect(articleServiceSpy.registerVote.calls.count()).toBe(1);
        expect(articleServiceSpy.registerVote.calls.mostRecent().args[0]).toEqual('12345678912');
        expect(articleServiceSpy.registerVote.calls.mostRecent().args[1]).toEqual('123456789055');
      });

      it('スナックバーでメッセージが表示される', () => {
        const containerElement = overlayContainerElement.querySelector('snack-bar-container');
        const snackBarText = containerElement.innerHTML;
        expect(snackBarText).toContain('記事にいいねしました。');
      });

      it('いいね数が増える', () => {
        const countVote = de.query(By.css('.comments__count_vote'));
        expect(countVote).not.toBeNull();
        expect(countVote.nativeElement.textContent).toContain('2人');
      });

      it('いいねボタンがいいね済みになる', () => {
        const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
        expect(voteBtn).not.toBeNull();
        expect(voteBtn.nativeElement.textContent).toContain('いいね済み');
      });


      describe('いいね済みクリック時', () => {

        beforeEach(() => {
          spyOn(dialog, 'open').and.callThrough();

          articleServiceSpy = de.injector.get(ArticleService);

          const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
          voteBtn.triggerEventHandler('click', null);
          fixture.detectChanges();
        });


        it('確認ダイアログが表示される', () => {
          expect(dialog.open).toHaveBeenCalled();
        });

        describe('いいえクリック時', () => {
          beforeEach((done) => {
            setTimeout(() => {
              dialog.cansel();
              fixture.detectChanges();
              done();
            }, 4000);
          });

          it('いいね削除処理は呼ばれない', () => {
            expect(articleServiceSpy.deleteVote.calls.count()).toBe(0);
          });
        });

        describe('はいクリック時', () => {
          beforeEach((done) => {
            setTimeout(() => {
              dialog.ok();
              fixture.detectChanges();
              done();
            }, 4000);
          });

          it('いいね削除処理がよばれる', () => {
            expect(articleServiceSpy.deleteVote.calls.count()).toBe(1);
            expect(articleServiceSpy.deleteVote.calls.mostRecent().args[0]).toBe('12345678912');
            expect(articleServiceSpy.deleteVote.calls.mostRecent().args[1]).toBe('123456789055');
          });

          it('スナックバーでメッセージが表示される', () => {
            const containerElement = overlayContainerElement.querySelector('snack-bar-container');
            const snackBarText = containerElement.innerHTML;
            expect(snackBarText).toContain('いいねを取り消しました。');
          });

          it('いいね数が減る', () => {
            const countVote = de.query(By.css('.comments__count_vote'));
            expect(countVote).not.toBeNull();
            expect(countVote.nativeElement.textContent).toContain('1人');
          });

          it('いいねボタンがいいねなる', () => {
            const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
            expect(voteBtn).not.toBeNull();
            expect(voteBtn.nativeElement.textContent).toContain('いいね!');
          });

        });
      });
    });



    describe('コメントするをクリック', () => {
      let commentServiceSpy: any;
      beforeEach(() => {
        commentServiceSpy =  de.injector.get(CommentService);
        const voteBtn = de.queryAll(By.css('.article__operation-btn'))[1];
        voteBtn.triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('コメント入力欄が表示される', () => {
        const commentForm = de.query(By.css('app-comment-form'));
        expect(commentForm).not.toBeNull();
      });

      describe('コメント入力欄のコメントボタンをクリック', () => {
        beforeEach(() => {
          const cancelButton = de.query(By.css('#mock-component-form-component-comment'));
          cancelButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('コメント入力欄が表示されない', () => {
          const commentForm = de.query(By.css('app-comment-form'));
          expect(commentForm).toBeNull();
        });

        it('コメントが再取得される', () => {
          expect(commentServiceSpy.getOfArticle.calls.count()).toBe(1);
          expect(commentServiceSpy.getOfArticle.calls.mostRecent().args[0]).toEqual('12345678912');
          expect(commentServiceSpy.getOfArticle.calls.mostRecent().args[1]).toEqual(true);
        });
      });


      describe('コメント入力欄のキャンセルボタンをクリック', () => {
        beforeEach(() => {
          const cancelButton = de.query(By.css('#mock-component-form-component-cancel'));
          cancelButton.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('コメント入力欄が表示されない', () => {
          const commentForm = de.query(By.css('app-comment-form'));
          expect(commentForm).toBeNull();
        });

        it('コメントが再取得されない', () => {
          expect(commentServiceSpy.getOfArticle.calls.count()).toBe(0);
        });
      });
    });

    describe('コメント詳細開くボタンをクリック', () => {
      beforeEach(() => {

        const openCommentDetailBtn = de.query(By.css('.comments__operation__show-detail-btn'));
        openCommentDetailBtn.triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('コメント詳細部が表示される', () => {
        const commentForm = de.query(By.css('.article__comments-detail'));
        expect(commentForm).not.toBeNull();
      });

      it('コメント詳細部閉じるボタン上部が表示される', () => {
        const closeCommentDetailBtn = de.query(By.css('.article__comments-detail__close-btn_top'));
        expect(closeCommentDetailBtn).not.toBeNull();
      });

      it('コメント詳細部閉じるボタン下部が表示される', () => {
        const closeCommentDetailBtn = de.query(By.css('.article__comments-detail__close-btn_bottom'));
        expect(closeCommentDetailBtn).not.toBeNull();
      });

      it('コメント詳細にいいねが表示される', () => {
        const voterList = de.query(By.css('app-voter-list'));
        expect(voterList).not.toBeNull();

        const votes = voterList.queryAll(By.css('.vote-mock-for-test'));
        expect(votes.length).toEqual(1);
      });

      it('コメント詳細にコメントが表示される', () => {
        const commentList = de.query(By.css('app-comment-list'));
        expect(commentList).not.toBeNull();

        const comments = commentList.queryAll(By.css('.comment-mock-for-test'));
        expect(comments.length).toEqual(2);
      });

      it('コメント詳細にコメントが表示される', () => {
        const commentList = de.query(By.css('app-comment-list'));
        expect(commentList).not.toBeNull();

        const replies = commentList.queryAll(By.css('.reply-mock-for-test'));
        expect(replies.length).toEqual(1);
      });

      describe('コメント詳細閉じるボタン上部クリック', () => {
        beforeEach(() => {
          const closeCommentDetailBtn = de.query(By.css('.article__comments-detail__close-btn_top'));
          closeCommentDetailBtn.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('コメント詳細部が表示されない', () => {
          const commentForm = de.query(By.css('.article__comments-detail'));
          expect(commentForm).toBeNull();
        });
      });

      describe('コメント詳細閉じるボタン下部クリック', () => {
        beforeEach(() => {
          const closeCommentDetailBtn = de.query(By.css('.article__comments-detail__close-btn_bottom'));
          closeCommentDetailBtn.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('コメント詳細部が表示されない', () => {
          const commentForm = de.query(By.css('.article__comments-detail'));
          expect(commentForm).toBeNull();
        });
      });


      xdescribe('コメント詳細閉じるボタン下部クリック', () => {
        beforeEach(() => {
          const closeCommentDetailBtn = de.query(By.css('.article__comments-detail__close-btn_down'));
          closeCommentDetailBtn.triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('コメント詳細部が表示されない', () => {
          const commentForm = de.query(By.css('.article__comments-detail'));
          expect(commentForm).toBeNull();
        });
      });
    });
  });



  describe('未認証時', () => {
    beforeEach( () => {
      TestBed.configureTestingModule({
        declarations: [
          TestCmpWrapperComponent,
          ArticleComponent,
          MockCommentFormComponent,
          MockCommentListComponent,
          MockVoterListComponent,
          ExcludeDeletedCommentPipe,
          ExcludeDeletedVoterPipe,
        ],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          SharedModule
        ],
        providers: [
          MessageService,
          MessageBarService,
          { provide: MatDialog, useClass: MokMatDialog },
          { provide: AuthenticationService, useClass: MockNotLoginAuthenticationService },
          { provide: CommentService, useClass: MockCommentService },
          { provide: ArticleService, useClass: MockArticleService },
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ComponentFixtureAutoDetect, useValue: true },
          MarkdownParseService,
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
      dialog = TestBed.get(MatDialog);
    });



    it('いいねボタンが表示されない', () => {
      const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
      expect(voteBtn).toBeUndefined();
    });

    it('コメントボタンが表示さない', () => {
      const commentBtn = de.queryAll(By.css('.article__operation-btn'))[1];
      expect(commentBtn).toBeUndefined();
    });
  });


  describe('証済時 記事ねのいいねが0件', () => {
    beforeEach( () => {
      TestBed.configureTestingModule({
        declarations: [
          NoVoteTestCmpWrapperComponent,
          ArticleComponent,
          MockCommentFormComponent,
          MockCommentListComponent,
          MockVoterListComponent,
          ExcludeDeletedCommentPipe,
          ExcludeDeletedVoterPipe,
        ],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          SharedModule
        ],
        providers: [
          MessageService,
          MessageBarService,
          { provide: MatDialog, useClass: MokMatDialog },
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: CommentService, useClass: MockCommentService },
          { provide: ArticleService, useClass: MockArticleService },
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ComponentFixtureAutoDetect, useValue: true },
          MarkdownParseService,
          ErrorStateMatcherContainParentGroup,
          {
            provide: ErrorStateMatcher,
            useClass: CustomErrorStateMatcher
          },
        ]
      });

      fixture = TestBed.createComponent(NoVoteTestCmpWrapperComponent);
      comp = fixture.componentInstance;

      de = fixture.debugElement;
      fixture.detectChanges();
      dialog = TestBed.get(MatDialog);
    });

    it('いいねボタンが表示される', () => {
      const voteBtn = de.queryAll(By.css('.article__operation-btn'))[0];
      expect(voteBtn).not.toBeNull();
      expect(voteBtn.nativeElement.textContent).toContain('いいね!');
    });

  });

});
