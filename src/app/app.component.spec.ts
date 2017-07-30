import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { ArticleService } from './services/article.service';

describe('AppComponent', () => {
  // テスト対象のComponent
  let component: AppComponent;

  // テスト対象のFixture
  let fixture: ComponentFixture<AppComponent>;

  // ArticleServiceのモック
  class ArticleServiceMock {
    getAll(): Observable<any> {
      const response =  { articles : [
          {
            title: 'テスト用タイトル1',
            body: 'テスト用ボティ1',
            date:  '20150101 12:30:30'
          },
          {
            title: 'テスト用タイトル2',
            body: 'テスト用ボティ2',
            date:  '20150101 12:34:30'
          },
          {
            title: 'テスト用タイトル3',
            body: 'テスト用ボティ3',
            date:  '20150101 12:31:30'
          }
      ]};

      return Observable.from([response]);
    }

  regist(title: string, body: string): Observable<any> {
      return Observable.from([{
        message: '記事を登録しました。',
        obj: {
          title: title,
          body: body,
          date: '20150101 12:31:30'
        }
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
          { provide: ArticleService, useClass: ArticleServiceMock },
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


  it('記事を３件保持しているか', async(() => {
    expect(component.articles).toEqual([
      {
        title: 'テスト用タイトル1',
        body: 'テスト用ボティ1',
        date:  '20150101 12:30:30'
      },
      {
        title: 'テスト用タイトル2',
        body: 'テスト用ボティ2',
        date:  '20150101 12:34:30'
      },
      {
        title: 'テスト用タイトル3',
        body: 'テスト用ボティ3',
        date:  '20150101 12:31:30'
      }
    ]);
  }));


  it('画面に記事が３件表示されているか', async(() => {

    const el = fixture.debugElement.nativeElement;

    const titles = el.querySelectorAll('.article-title');
    expect(titles.length).toEqual(3);
    expect(titles[0].textContent).toContain('テスト用タイトル1');
    expect(titles[1].textContent).toContain('テスト用タイトル2');
    expect(titles[2].textContent).toContain('テスト用タイトル3');

    const bodies = el.querySelectorAll('.article-body');
    expect(bodies.length).toEqual(3);
    expect(bodies[0].textContent).toContain('テスト用ボティ1');
    expect(bodies[1].textContent).toContain('テスト用ボティ2');
    expect(bodies[2].textContent).toContain('テスト用ボティ3');

    const dates = el.querySelectorAll('.article-date');
    expect(dates.length).toEqual(3);
    expect(dates[0].textContent).toContain('20150101 12:30:30');
    expect(dates[1].textContent).toContain('20150101 12:34:30');
    expect(dates[2].textContent).toContain('20150101 12:31:30');


  }));
});
