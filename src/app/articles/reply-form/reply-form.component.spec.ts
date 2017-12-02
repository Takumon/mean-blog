import {
  ComponentFixture,
  TestBed,
  async,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule　} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';

import {
  ErrorStateMatcher,
} from '@angular/material';

import { ErrorStateMatcherContainParentGroup } from '../../shared/services/message.service';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';

import { Constant } from '../../shared/constant';

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
    update() {}
    register() {}
  }

  let comp: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;
  let de: DebugElement;


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
    de = fixture.debugElement;
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
      const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
      expect($textArea.getAttribute('placeholder')).toEqual('コメントを追加する');
    });

    it('textareaにフォーカスが当たっているべきでない', () => {
      const $focused = de.query(By.css(':focus'));
      expect($focused).toEqual(null);
    });

    it('キャンセルボタンが存在せず、追加ボタンのみ存在すべき', () => {
      const $buttons = de.queryAll(By.css('.comment-form__operation button'));
      expect($buttons.length).toEqual(1);
      expect($buttons[0].nativeElement.textContent.trim()).toEqual('追加');
    });

    it('追加ボタンは非活性であるべき', () => {
      const $buttons = de.queryAll(By.css('.comment-form__operation button'));
      expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
    });

    it('入力チェックエラーが存在すべき', () => {
      expect(comp.form.valid).toEqual(false);
    });

    it('入力チェックエラーメッセージが存在べきでない', () => {
      const $errors = de.queryAll(By.css('.mat-error'));
      expect($errors.length).toEqual(0);
    });

    it('入力文字数が表示されるべき', () => {
      const $hints = de.queryAll(By.css('.mat-hint'));
      expect($hints.length).toEqual(1);
      expect($hints[0].nativeElement.textContent).toEqual('0 / 400文字');
    });


    describe('追加ボタン押下した場合', () => {
      let replyService: ReplyService;
      let spyOfUpsert;
      let spyOfRegisterOfReplyService;
      let spyOfUpdateOfReplyService;

      beforeEach(() => {
        spyOfUpsert = spyOn(comp, 'upsert').and.callThrough();
        replyService = de.injector.get(ReplyService);
        spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(Observable.of(new ReplyModel()));
        spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(Observable.of(new ReplyModel()));
        // 追加ボタン押下前
        expect(comp.model._id).toEqual(undefined);
        expect(comp.model.articleId).toEqual(undefined);
        expect(comp.model.commentId).toEqual(undefined);
        expect(comp.model.text).toEqual(undefined);
        expect(comp.model.user).toEqual(undefined);
        expect(comp.model.created).toEqual(undefined);
        expect(comp.model.updated).toEqual(undefined);
        expect(comp.model.isEditable).toEqual(undefined);
        expect(comp.model.addReply).toEqual(undefined);
        const $upsertBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
        $upsertBtn.triggerEventHandler('click', null);

      });

      it('upsertが呼ばれるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(spyOfUpsert).toHaveBeenCalled();
      }));

      it('ReplyService#updateとReplyService#registerは呼ばれるべきでない', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        expect(spyOfUpdateOfReplyService).not.toHaveBeenCalled();
        expect(spyOfRegisterOfReplyService).not.toHaveBeenCalled();
      }));
    });


    describe('1文字入力した時', () => {
      beforeEach(() => {
        const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
        $textArea.value = 'a';
        $textArea.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('入力チェックエラーが存在すべきでない', () => {
        expect(comp.form.valid).toEqual(true);
      });

      it('追加ボタンは活性であるべき', () => {
        const $buttons = de.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
      });

      it('入力文字数が表示されるべき', () => {
        const $hints = de.queryAll(By.css('.mat-hint'));
        expect($hints.length).toEqual(1);
        expect($hints[0].nativeElement.textContent).toEqual('1 / 400文字');
      });


      describe('追加ボタン押下した場合', () => {
        let replyService: ReplyService;
        let spyOfUpsert;
        let spyOfRegisterOfReplyService;
        let spyOfUpdateOfReplyService;
        let snackbar: MatSnackBar;
        let spyOfOpenOfSnackbar;


        beforeEach(() => {
          spyOfUpsert = spyOn(comp, 'upsert').and.callThrough();
          replyService = de.injector.get(ReplyService);
          spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(Observable.of(new ReplyModel()));
          spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(Observable.of(new ReplyModel()));
          snackbar = de.injector.get(MatSnackBar);
          spyOfOpenOfSnackbar = spyOn(snackbar, 'open');

          // 追加ボタン押下前
          expect(comp.model._id).toEqual(undefined);
          expect(comp.model.articleId).toEqual(undefined);
          expect(comp.model.commentId).toEqual(undefined);
          expect(comp.model.text).toEqual(undefined);
          expect(comp.model.user).toEqual(undefined);
          expect(comp.model.created).toEqual(undefined);
          expect(comp.model.updated).toEqual(undefined);
          expect(comp.model.isEditable).toEqual(undefined);
          expect(comp.model.addReply).toEqual(undefined);

          const $upsertBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
          $upsertBtn.triggerEventHandler('click', null);
        });

        it('upsertが呼ばれるべき', fakeAsync((done) => {
          fixture.detectChanges();
          tick();

          expect(spyOfUpsert).toHaveBeenCalled();
        }));

        it('completeイベントが発生すべき', fakeAsync((done) => {
          comp.complete.subscribe(() => {
            done();
          });

          fixture.detectChanges();
          tick();
        }));

        it('formがリセットされるべき', fakeAsync((done) => {
          fixture.detectChanges();
          tick();

          expect(comp.text.value).toEqual(null);
        }));

        it('modelにformのtextがセットされるべき', fakeAsync((done) => {
          fixture.detectChanges();
          tick();

          expect(comp.model.text).toEqual('a');
        }));

        it('ReplyService#registerが呼ばれるべき', fakeAsync((done) => {
          fixture.detectChanges();
          tick();

          expect(spyOfRegisterOfReplyService).toHaveBeenCalled();
          expect(spyOfUpdateOfReplyService).not.toHaveBeenCalled();
        }));

        it('SnackBarが呼ばれるべき', fakeAsync((done) => {
          fixture.detectChanges();
          tick();

          expect(spyOfOpenOfSnackbar).toHaveBeenCalled();
          expect(spyOfOpenOfSnackbar).toHaveBeenCalledWith('リプライを追加しました。', null, Constant.SNACK_BAR_DEFAULT_OPTION);
        }));

      });

      describe('さらに入力した文字を削除した時', () => {
        beforeEach(async() => {
          const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
          $textArea.value = '';
          $textArea.dispatchEvent(new Event('input'));
          fixture.detectChanges();
        });

        it('入力文字数が表示されるべきでない', () => {
          const $hints = de.queryAll(By.css('.mat-hint'));
          expect($hints.length).toEqual(0);
        });

        it('入力チェックエラーが存在すべき', () => {
          expect(comp.form.valid).toEqual(false);
        });

        it('必須入力チェックエラーメッセージが存在すべき', () => {
          const $errors = de.queryAll(By.css('.mat-error'));
          expect($errors[0].nativeElement.textContent.trim()).toEqual('コメント本文を入力してください');
        });

        it('追加ボタンが活性であるべき', () => {
          fixture.whenStable().then(() => {
            const $buttons = de.queryAll(By.css('.comment-form__operation button'));
            expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
          });
        });
      });
    });


    describe('400文字入力した時', () => {
      beforeEach(() => {
        const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
        let text = '';
        for (let i = 0; i < 400; i++) {
          text += 'a';
        }
        $textArea.value = text;

        $textArea.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('入力チェックエラーが存在すべきでない', () => {
        expect(comp.form.valid).toEqual(true);
      });

      it('追加ボタンは活性であるべき', () => {
        const $buttons = de.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
      });
    });

    describe('401文字入力した時', () => {
      beforeEach(() => {
        const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
        let text = '';
        for (let i = 0; i < 401; i++) {
          text += 'a';
        }
        $textArea.value = text;

        $textArea.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('入力チェックエラーが存在すべき', () => {
        expect(comp.form.valid).toEqual(false);
      });

      it('追加ボタンは非活性であるべき', () => {
        const $buttons = de.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
      });

      it('最大桁数入力チェックエラーメッセージが存在すべき', () => {
        const $errors = de.queryAll(By.css('.mat-error'));
        expect($errors[0].nativeElement.textContent.trim()).toEqual('コメント本文は400文字以下にしてください 401 / 400文字');
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
      const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
      expect($textArea.getAttribute('placeholder')).toEqual('コメントを更新する');
    });

    it('更新ボタンは活性であるべき', () => {
      const $buttons = de.queryAll(By.css('.comment-form__operation button'));
      expect($buttons[0].nativeElement.textContent.trim()).toEqual('更新');
      expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
    });

    it('入力文字数が表示されるべき', () => {
      const $hints = de.queryAll(By.css('.mat-hint'));
      expect($hints.length).toEqual(1);
      expect($hints[0].nativeElement.textContent).toEqual('4 / 400文字');
    });

    it('入力チェックエラーが存在すべきでない', () => {
      expect(comp.form.valid).toEqual(true);
    });

    describe('リプライを変更して更新ボタン押下した場合', () => {
      let replyService: ReplyService;
      let spyOfUpsert;
      let spyOfRegisterOfReplyService;
      let spyOfUpdateOfReplyService;
      let snackbar: MatSnackBar;
      let spyOfOpenOfSnackbar;


      beforeEach(() => {
        const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
        $textArea.value = $textArea.value + 'ふが';
        $textArea.dispatchEvent(new Event('input'));
        fixture.detectChanges();


        spyOfUpsert = spyOn(comp, 'upsert').and.callThrough();
        replyService = de.injector.get(ReplyService);
        spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(Observable.of(new ReplyModel()));
        spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(Observable.of(new ReplyModel()));
        snackbar = de.injector.get(MatSnackBar);
        spyOfOpenOfSnackbar = spyOn(snackbar, 'open');


        // ボタン押下前
        expect(comp.model._id).toEqual('123456789012');
        expect(comp.model.articleId).toEqual(undefined);
        expect(comp.model.commentId).toEqual(undefined);
        expect(comp.model.text).toEqual('ほげほげ');
        expect(comp.model.user).toEqual(undefined);
        expect(comp.model.created).toEqual('201712021230');
        expect(comp.model.updated).toEqual('201712021230');
        expect(comp.model.isEditable).toEqual(undefined);
        expect(comp.model.addReply).toEqual(undefined);

        const $upsertBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
        $upsertBtn.triggerEventHandler('click', null);
      });

      it('upsertが呼ばれるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(spyOfUpsert).toHaveBeenCalled();
      }));

      it('completeイベントが発生すべき', fakeAsync((done) => {
        comp.complete.subscribe(() => {
          done();
        });

        fixture.detectChanges();
        tick();
      }));

      it('formがリセットされるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(comp.text.value).toEqual(null);
      }));

      it('modelにformのtextがセットされるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(comp.model.text).toEqual('ほげほげふが');
      }));

      it('ReplyService#updateが呼ばれるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(spyOfRegisterOfReplyService).not.toHaveBeenCalled();
        expect(spyOfUpdateOfReplyService).toHaveBeenCalled();
      }));

      it('SnackBarが呼ばれるべき', fakeAsync((done) => {
        fixture.detectChanges();
        tick();

        expect(spyOfOpenOfSnackbar).toHaveBeenCalled();
        expect(spyOfOpenOfSnackbar).toHaveBeenCalledWith('リプライを更新しました。', null, Constant.SNACK_BAR_DEFAULT_OPTION);
      }));

    });
  });


  describe('キャンセルボタンフラグがtrue_自動フォーカスフラグがfalse_modelが新規の場合', () => {
    beforeEach(() => {
      comp.hasCancelBtn = true;
      comp.isAuthfocuse = false;
      const model = new ReplyModel();
      comp.model = model;
      fixture.detectChanges();
    });

    it('キャンセルボタンが存在すべき', () => {
      const $buttons = de.queryAll(By.css('.comment-form__operation button'));
      expect($buttons.length).toEqual(2);
      expect($buttons[0].nativeElement.textContent.trim()).toEqual('キャンセル');
    });

    it('キャンセルボタン押下時にcancelイベントが発生すべき', (done) => {
      comp.cancel.subscribe(() => {
        expect(true).toEqual(true);
        done();
      });

      const $cancelBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
      $cancelBtn.triggerEventHandler('click', null);
    }, 5000);
  });

  describe('キャンセルボタンフラグがfalse_自動フォーカスフラグがtrue_modelが新規の場合', () => {
    beforeEach(() => {
      comp.hasCancelBtn = false;
      comp.isAuthfocuse = true;
      const model = new ReplyModel();
      comp.model = model;
    });

    it('textareaにフォーカスが当たっているべき', () => {
      fixture.detectChanges();

      const $textarea = de.query(By.css('.comment-form__textarea')).nativeElement;
      const $focused = de.query(By.css(':focus')).nativeElement;
      expect($focused).toEqual($textarea);
    });
  });
});
