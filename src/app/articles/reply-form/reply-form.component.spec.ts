import {
  ComponentFixture,
  TestBed,
  async,
  inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule　} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import {
  ErrorStateMatcher,
} from '@angular/material';

import { ErrorStateMatcherContainParentGroup } from '../../shared/services/message.service';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';


import { MessageBarService } from '../../shared/services/message-bar.service';
import { MessageService } from '../../shared/services/message.service';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticationService } from '../../shared/services/authentication.service';

import { ReplyService } from '../shared/reply.service';
import { ReplyModel } from '../shared/reply.model';
import { UserModel } from '../../users/shared/user.model';
import { ReplyWithUserModel } from '../shared/reply-with-user.model';
import { ReplyWithArticleModel } from '../shared/reply-with-article.model';

import { ReplyFormComponent } from './reply-form.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



// テスト用Component
import { Component } from '@angular/core';

@Component({
  template: `
  <app-reply-form
    [model]="model"
    [hasCancelBtn]="hasCancelBtn"
    [isAuthfocuse]="isAuthfocuse"
    (complete)="refreshComments()"
    (cancel)="cancel()"
  ></app-reply-form>
`
})
class TestHostComponent {
  model: ReplyModel;
  hasCancelBtn = true;
  isAuthfocuse = false;

  constructor() {
    const model = new ReplyModel();
    model.text = 'テスト用リプライコメント';
    model.created = '20171130 12:30';
    this.model = model;
  }

  refreshComments() {
    console.log('refreshComments');
  }
  cancel() {
    console.log('cancel');
  }
}



describe('ReplyFormComponent', () => {



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

  class MockReplyService {
    // 登録
    register(reply: ReplyModel, withUser: boolean = false , withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
      reply._id = '123456789012';
      reply.created = '2017/11/30 12:30';
      reply.updated = '2017/11/30 12:30';

      return Observable.of(reply);
    }

    // 更新（差分更新）
    update(reply: ReplyModel, withUser: boolean = false, withArticle: boolean = false): Observable<ReplyModel | ReplyWithUserModel | ReplyWithArticleModel> {
      reply.updated = '2017/12/1 12:30';
      return Observable.of(reply);
    }
  }



  let comp: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;


  // let testHost: TestHostComponent;
  // let fixture: ComponentFixture<TestHostComponent>;
  // let heroEl: DebugElement;

  beforeEach(async() => {

    TestBed.configureTestingModule({
      declarations: [ ReplyFormComponent, TestHostComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        ErrorStateMatcherContainParentGroup,
        {
          provide: ErrorStateMatcher,
          useClass: CustomErrorStateMatcher
        },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ReplyService, useClass: MockReplyService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        MessageBarService,
        MessageService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyFormComponent);
    comp = fixture.componentInstance;
  });

  describe('キャンセルボタンフラグがfalse_自動フォーカスフラグがfalse_modelが新規の場合', () => {
    beforeEach(() => {
      comp.hasCancelBtn = false;
      comp.isAuthfocuse = false;
      const model = new ReplyModel();
      comp.model = model;
      fixture.detectChanges();
    });

    it('プレースホルダーが追加パターンになるべき', () => {
      const $textArea = fixture.debugElement.query(By.css('.comment-form__textarea')).nativeElement;
      expect($textArea.getAttribute('placeholder')).toEqual('コメントを追加する');
    });

    it('キャンセルボタンが存在せず、追加ボタンのみ存在すべき', () => {
      const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
      expect($buttons.length).toEqual(1);
      expect($buttons[0].nativeElement.textContent).toEqual('  追加');
    });

    it('追加ボタンは非活性であるべき', () => {
      const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
      expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
    });

    it('入力チェックエラーが存在すべき', () => {
      expect(comp.form.valid).toEqual(false);
    });

    describe('一文字入力した時', () => {
      beforeEach(() => {
        const $textArea = fixture.debugElement.query(By.css('.comment-form__textarea')).nativeElement;
        $textArea.value = 'a';
        $textArea.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('入力チェックエラーが存在しないべき', () => {
        expect(comp.form.valid).toEqual(true);
      });

      it('追加ボタンは活性であるべき', () => {
        const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
      });

      describe('さらに入力した文字を削除した時', () => {
        beforeEach(async() => {
          const $textArea = fixture.debugElement.query(By.css('.comment-form__textarea')).nativeElement;
          $textArea.value = '';
          $textArea.dispatchEvent(new Event('input'));
          fixture.detectChanges();
        });

        it('入力チェックエラーが存在すべき', () => {
          expect(comp.form.valid).toEqual(false);
          const $errors = fixture.debugElement.queryAll(By.css('.mat-error'));
          expect($errors[0].nativeElement.textContent.trim()).toEqual('コメント本文を入力してください');
        });

        it('追加ボタンは活性であるべき', () => {
          fixture.whenStable().then(() => {
            const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
            expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
          });
        });
      });
    });


  });

  describe('キャンセルボタンフラグがfalse_自動フォーカスフラグがfalse_modelが既存の場合', () => {
    beforeEach(() => {
      comp.hasCancelBtn = false;
      comp.isAuthfocuse = false;
      const model = new ReplyModel();
      model.text = 'ほげほげ';
      model._id = '123456789012';
      model.created = '201712021230';
      model.updated = '201712021230';
      comp.model = model;
      fixture.detectChanges();
    });

    it('プレースホルダーが更新パターンになるべき', () => {
      const $textArea = fixture.debugElement.query(By.css('.comment-form__textarea')).nativeElement;
      expect($textArea.getAttribute('placeholder')).toEqual('コメントを更新する');
    });

    it('キャンセルボタンが存在せず、更新ボタンのみ存在すべき', () => {
      const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
      expect($buttons.length).toEqual(1);
      expect($buttons[0].nativeElement.textContent).toEqual('  更新');
    });

    it('更新ボタンは活性であるべき', () => {
      const $buttons = fixture.debugElement.queryAll(By.css('.comment-form__operation button'));
      expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
    });

    it('入力チェックエラーが存在しないべき', () => {
      expect(comp.form.valid).toEqual(true);
    });
  });


});
