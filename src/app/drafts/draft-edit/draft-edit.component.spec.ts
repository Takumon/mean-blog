import { Observable, of } from 'rxjs';
import 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from '../../state';
import * as fromFeature from '../state';


import { SharedModule } from '../../shared/shared.module';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import {
  AuthenticationService,
  MessageService,
  MessageBarService,
  ErrorStateMatcherContainParentGroup,
  ImageService,
  MarkdownParseService,
  ArticleService,
} from '../../shared/services';
import {
  UserModel,
  ArticleWithUserModel,
  ArticleModel,
} from '../../shared/models';


import { DraftService } from '../shared/draft.service';
import { DraftEditComponent } from './draft-edit.component';
import * as DraftActions from '../state/draft.actions';


describe('DraftDetailComponent', () => {

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
      return of(model);
    }
  }

  class MockImageservice {

  }

  class MockDraftService {
    getById(_id: string, withUser: Boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
      const model: ArticleWithUserModel = {
        _id: '123456789012',
        title: 'サンプル下書きタイトル',
        body: 'サンプル下書きボディ',
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
      return of(model);
    }
  }

  class MockMarkdownParseService {
    parse(rawText: string, baseUrl: string = null): any {
      return { text: rawText, toc: [] };
    }
  }

  class MockActivatedRoute {
    queryParams: Observable<Object> = of({
      resume: 'false',
    });

    params: Observable<Object> = of({
      _id: '123456789099',
    });
  }

  let comp: DraftEditComponent;
  let fixture: ComponentFixture<DraftEditComponent>;
  let de: DebugElement;

  beforeEach(async() => {

    TestBed.configureTestingModule({
      declarations: [
        DraftEditComponent,
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'feature': combineReducers(fromFeature.reducers)
        }),
      ],
      providers: [
        ErrorStateMatcherContainParentGroup,
        {
          provide: ErrorStateMatcher,
          useClass: CustomErrorStateMatcher
        },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ArticleService, useClass: MockArticleService },
        { provide: DraftService, useClass: MockDraftService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MarkdownParseService, useClass: MockMarkdownParseService },
        { provide: ImageService, useClass: MockImageservice },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        MessageBarService,
        MessageService,
        provideMockActions(() => of()),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEditComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(comp).toBeTruthy();
  });
});
