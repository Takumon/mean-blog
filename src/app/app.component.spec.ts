import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { MessageService } from './message/message.service';

describe('AppComponent', () => {
  // テスト対象のComponent
  let component: AppComponent;

  // テスト対象のFixture
  let fixture: ComponentFixture<AppComponent>;

  // MessageServiceのモック
  class MessageServiceMock {
    getAll(): Observable<any> {
      const response =  { messages : [
        { message : 'テスト用メッセージ1' },
        { message : 'テスト用メッセージ2' },
        { message : 'テスト用メッセージ3' }
      ]};

      return Observable.from([response]);
    }

  regist(message: string): Observable<any> {
      return Observable.from([{
        message: 'テスト用メッセージ4'
      }]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [
        AppComponent
      ],
    })

    .overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: MessageService, useClass: MessageServiceMock },
        ]
      }
    })

    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('オブジェクトが生成されるか', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));


  it('メッセージを３件保持しているか', async(() => {
    expect(component.messages).toEqual([
        { message : 'テスト用メッセージ1' },
        { message : 'テスト用メッセージ2' },
        { message : 'テスト用メッセージ3' }
    ]);
  }));


  it('画面にメッセージが３件表示されているか', async(() => {

    const el = fixture.debugElement.nativeElement;

    expect(el.querySelectorAll('li').length).toEqual(3);
    expect(el.querySelectorAll('li')[0].textContent).toContain('テスト用メッセージ1');
    expect(el.querySelectorAll('li')[1].textContent).toContain('テスト用メッセージ2');
    expect(el.querySelectorAll('li')[2].textContent).toContain('テスト用メッセージ3');
  }));
});
