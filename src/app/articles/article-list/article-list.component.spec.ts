import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
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
import { UserModel } from '../../users/shared/user.model';

import { ArticleListComponent } from './article-list.component';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ScrollService } from '../../shared/services/scroll.service';
import { PaginatorService } from '../../shared/services/paginator.service';
import { UserService } from '../../users/shared/user.service';

describe('ArticleListComponent', () => {

  @Component({
    selector: 'app-article',
    template: '<p>Mock Article Component</p>'
  })
  class MockArticleComponent {
    @Input() item: ArticleWithUserModel;
  }

  @Component({
    selector: 'app-search-condition',
    template: '<p>Mock Serch Condition</p>'
  })
  class MockSearchConditionComponent {
    @Output() changeSeaerchCondition = new EventEmitter();
  }

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

  class MockArticleService {

  }

  class MockUserService {

  }

  let comp: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let de: DebugElement;

  beforeEach(async() => {

    TestBed.configureTestingModule({
      declarations: [
        ArticleListComponent,
        MockArticleComponent,
        MockSearchConditionComponent,
      ],
      imports: [
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
        { provide: ArticleService, useClass: MockArticleService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: UserService, useClass: MockUserService },
        ScrollService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleListComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });


  it('オブジェクトが生成されるべき', () => {
    expect(comp).toBeTruthy();
  });
});
