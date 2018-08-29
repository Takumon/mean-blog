import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import * as fromArticle from '../state';
import { ArticleEffects } from './article.effects';
import { ArticleService, VoteCudResponse } from '../shared/services';
import { UserModel } from '../shared/models';
import { StoreModule } from '@ngrx/store';



class MockArticleService {
  private isRegistered = false;

  getVote = jasmine.createSpy('getHero').and.callFake(
    (articleId: string) => {
      const voters: UserModel[] = [];

      voters.push({
        _id: '123456789012',
        userId: 'sampleUserId',
        isAdmin: false,
        created: '2018-02-11T23:39:37.263Z',
        updated: '2018-02-11T23:39:37.263Z'
      });

      if (this.isRegistered) {
        voters.push({
          _id: '123456789055',
          userId: 'SampleLoginUserId',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        });
      }

      return of(voters);
    }
  );

  registerVote = jasmine.createSpy('getHero').and.callFake(
    (articleId: string, voterId: string) => {
      this.isRegistered = true;
      const article: VoteCudResponse = {
        message: '記事にいいねしました。',
        obj: [{
          _id: '1234580000',
          userId: 'SampleUserId',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
      };
      return of(article);
    }
  );

  deleteVote = jasmine.createSpy('getHero').and.callFake(
    (articleId: string, voterId: string) => {
      this.isRegistered = false;
      const article: VoteCudResponse = {
        message: 'いいねを取り消しました。',
        obj: [{
          _id: '1234580000',
          userId: 'SampleUserId',
          isAdmin: false,
          created: '2018-02-11T23:39:37.263Z',
          updated: '2018-02-11T23:39:37.263Z'
        }],
      };
      return of(article);
    }
  );
}



describe('ArticleEffects', () => {
  let actions$: Observable<any>;
  let effects: ArticleEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromArticle.reducers
        })
      ],
      providers: [
        ArticleEffects,
        provideMockActions(() => actions$),
        { provide: ArticleService, useClass: MockArticleService },
      ]
    });

    effects = TestBed.get(ArticleEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
