import { Observable, of, throwError } from 'rxjs';
import 'rxjs';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';

import { SharedModule } from '../../shared/shared.module';

import { ErrorStateMatcherContainParentGroup } from '../../shared/services/message.service';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import { Constant } from '../../shared/constant';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { MessageService } from '../../shared/services/message.service';
import { AuthenticationService } from '../../shared/services/authentication.service';

import { ReplyService } from '../shared/reply.service';
import {
  UserModel,
  ReplyModel,
} from '../../shared/models';

import { ReplyFormComponent } from './reply-form.component';




describe('ReplyFormComponent', () => {

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

  class MockReplyService {
    update() {}
    register() {}
  }

  let comp: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;
  let de: DebugElement;


  beforeEach(async() => {

    TestBed.configureTestingModule({
      declarations: [ ReplyFormComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule,
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

    it('プレースホルダーが登録パターンになるべき', () => {
      const $textArea = de.query(By.css('.comment-form__textarea')).nativeElement;
      expect($textArea.getAttribute('placeholder')).toEqual('コメントを登録する');
    });

    it('textareaにフォーカスが当たっているべきでない', () => {
      const $focused = de.query(By.css(':focus'));
      expect($focused).toEqual(null);
    });

    it('キャンセルボタンが存在せず、登録ボタンのみ存在すべき', () => {
      const $buttons = de.queryAll(By.css('.comment-form__operation button'));
      expect($buttons.length).toEqual(1);
      expect($buttons[0].nativeElement.textContent).toContain('登録');
    });

    it('登録ボタンは非活性であるべき', () => {
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


    describe('登録ボタン押下した場合', () => {
      let replyService: ReplyService;
      let spyOfUpsert;
      let spyOfRegisterOfReplyService;
      let spyOfUpdateOfReplyService;

      beforeEach(() => {
        spyOfUpsert = spyOn(comp, 'upsert').and.callThrough();
        replyService = de.injector.get(ReplyService);
        spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(of(new ReplyModel()));
        spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(of(new ReplyModel()));
        // 登録ボタン押下前
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

      it('登録ボタンは活性であるべき', () => {
        const $buttons = de.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(false);
      });

      it('入力文字数が表示されるべき', () => {
        const $hints = de.queryAll(By.css('.mat-hint'));
        expect($hints.length).toEqual(1);
        expect($hints[0].nativeElement.textContent).toEqual('1 / 400文字');
      });


      describe('登録ボタン押下した場合', () => {
        let replyService: ReplyService;
        let spyOfUpsert;
        let spyOfRegisterOfReplyService;
        let spyOfUpdateOfReplyService;
        let snackbar: MatSnackBar;
        let spyOfOpenOfSnackbar;


        beforeEach(() => {
          spyOfUpsert = spyOn(comp, 'upsert').and.callThrough();
          replyService = de.injector.get(ReplyService);
          snackbar = de.injector.get(MatSnackBar);
          spyOfOpenOfSnackbar = spyOn(snackbar, 'open');

          // 登録ボタン押下前
          expect(comp.model._id).toEqual(undefined);
          expect(comp.model.articleId).toEqual(undefined);
          expect(comp.model.commentId).toEqual(undefined);
          expect(comp.model.text).toEqual(undefined);
          expect(comp.model.user).toEqual(undefined);
          expect(comp.model.created).toEqual(undefined);
          expect(comp.model.updated).toEqual(undefined);
          expect(comp.model.isEditable).toEqual(undefined);
          expect(comp.model.addReply).toEqual(undefined);

        });

        describe('登録に成功する場合', () => {
          beforeEach(() => {
            spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(of(new ReplyModel()));
            spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(of(new ReplyModel()));
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
            expect(spyOfOpenOfSnackbar).toHaveBeenCalledWith('リプライを登録しました。', null, Constant.SNACK_BAR_DEFAULT_OPTION);
          }));
        });

        describe('登録に失敗する場合', () => {

          describe('リプライコメントの入力チェックエラー2件の場合', () => {
            beforeEach(() => {
              spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(throwError({
                errors: [
                  {
                    param: 'text',
                    msg: 'コメント本文の入力チェックエラー1件目'
                  },
                  {
                    param: 'text',
                    msg: 'コメント本文の入力チェックエラー2件目'
                  }
                ]
              }));
              spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(of(new ReplyModel()));
              const $upsertBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
              $upsertBtn.triggerEventHandler('click', null);
            });

            it('upsertが呼ばれるべき', fakeAsync(() => {
              fixture.detectChanges();
              tick();

              expect(spyOfUpsert).toHaveBeenCalled();
            }));

            it('ReplyService#registerが呼ばれるべき', fakeAsync(() => {
              fixture.detectChanges();
              tick();

              expect(spyOfRegisterOfReplyService).toHaveBeenCalled();
            }));

            it('入力チェックエラーメッセージが表示されるべき', fakeAsync(() => {
              fixture.detectChanges();
              tick();

              const errorMessages = de.queryAll(By.css('.mat-error'))[0].nativeElement.textContent;
              expect(errorMessages).toContain('コメント本文の入力チェックエラー1件目');
              expect(errorMessages).toContain('コメント本文の入力チェックエラー2件目');
            }));
          });


          describe('共通入力チェックエラー2件の場合', () => {
            let messageBarService: MessageBarService;
            let spyOfshowValidationErrorOfMessageBarService;

            beforeEach(() => {
              messageBarService = de.injector.get(MessageBarService);
              spyOfshowValidationErrorOfMessageBarService = spyOn(messageBarService, 'showValidationError').and.callThrough();
              spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(throwError({
                errors: [
                  {
                    param: 'common',
                    msg: '共通入力チェックエラー1件目'
                  },
                  {
                    param: 'common',
                    msg: '共通入力チェックエラー2件目'
                  }
                ]
              }));
              spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(of(new ReplyModel()));
              const $upsertBtn: DebugElement  = fixture.debugElement.queryAll(By.css('.comment-form__operation button'))[0];
              $upsertBtn.triggerEventHandler('click', null);
            });

            it('エラーメッセージがSnackbarで表示されるべき', fakeAsync(() => {
              fixture.detectChanges();
              tick();

              expect(de.queryAll(By.css('.mat-error')).length).toEqual(0);
              expect(spyOfshowValidationErrorOfMessageBarService).toHaveBeenCalledWith({
                errors: [
                  {
                    param: 'common',
                    msg: '共通入力チェックエラー1件目'
                  },
                  {
                    param: 'common',
                    msg: '共通入力チェックエラー2件目'
                  }
                ]
              });
            }));
          });

        });
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
          expect($errors[0].nativeElement.textContent).toContain('コメント本文を入力してください');
        });

        it('登録ボタンが活性であるべき', () => {
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

      it('登録ボタンは活性であるべき', () => {
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

      it('登録ボタンは非活性であるべき', () => {
        const $buttons = de.queryAll(By.css('.comment-form__operation button'));
        expect($buttons[0].nativeElement.hasAttribute('disabled')).toEqual(true);
      });

      it('最大桁数入力チェックエラーメッセージが存在すべき', () => {
        const $errors = de.queryAll(By.css('.mat-error'));
        expect($errors[0].nativeElement.textContent).toContain('コメント本文は400文字以下にしてください 401 / 400文字');
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
      expect($buttons[0].nativeElement.textContent).toContain('更新');
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
        spyOfRegisterOfReplyService = spyOn(replyService, 'register').and.returnValue(of(new ReplyModel()));
        spyOfUpdateOfReplyService = spyOn(replyService, 'update').and.returnValue(of(new ReplyModel()));
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
      expect($buttons[0].nativeElement.textContent).toContain('キャンセル');
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

    xit('textareaにフォーカスが当たっているべき', () => {
      fixture.detectChanges();

      const $textarea = de.query(By.css('.comment-form__textarea')).nativeElement;
      const $focused = de.query(By.css(':focus')).nativeElement;
      expect($focused).toEqual($textarea);
    });
  });
});
