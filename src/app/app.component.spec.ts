import { Observable, of } from 'rxjs';
import 'rxjs';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material';

import { SharedModule } from './shared/shared.module';
import { CustomErrorStateMatcher } from './shared/custom-error-state-matcher';
import {
  RouteNamesService,
  AuthenticationService,
  ErrorStateMatcherContainParentGroup,
} from './shared/services';
import { UserModel } from './shared/models';

import { ScrollService } from './articles/shared/scroll.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

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

  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
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
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        RouteNamesService,
        ScrollService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });


  it('オブジェクトが生成されるべき', async(() => {
    expect(comp).toBeTruthy();
  }));
});
