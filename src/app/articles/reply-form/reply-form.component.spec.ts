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





describe('ReplyFormComponent', () => {
  let comp: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;


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


  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ ReplyFormComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ReplyService, useClass: MockReplyService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        MessageBarService,
        MessageService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyFormComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('.comment-form'));
    el = de.nativeElement;


    // comp.isAuthfocuse = false;
    // comp.hasCancelBtn = false;
    // const model = new ReplyModel();
    // model.text = 'テスト用リプライコメント';
    // model.created = '20171130 12:30';
    // comp.model = model;

    // fixture.detectChanges();
  });


  it('try', () => {
    expect(true).toEqual(true);
  });
  // it('actionが更新か', async(() => {
  //   expect(comp.action).toEqual('更新');
  // }));
});
