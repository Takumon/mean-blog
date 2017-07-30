import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleUpdateComponent } from './article-update.component';

describe('ArticleDetailComponent', () => {
  let component: ArticleUpdateComponent;
  let fixture: ComponentFixture<ArticleUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
