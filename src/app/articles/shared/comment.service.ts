import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { CommentModel } from './comment.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentWithArticleModel } from './comment-with-article.model';


interface HttpOption {
  condition?: Object;
  withUser: boolean;
  withArticle: boolean;
}

@Injectable()
export class CommentService {
  private Constant = Constant;
  private baseCommentUrl = '/api/comments';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>> {
    const URL = this.baseCommentUrl;

    const options = this.constructOptions({ condition, withUser, withArticle });

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>>(URL, options);
  }

  register(comment: CommentModel, withUser: boolean = false , withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = this.baseCommentUrl;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.post<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, comment, options);
  }

  // 必ず差分更新とする
  update(comment: CommentModel, withUser: boolean = false, withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = `${this.baseCommentUrl}/${comment._id}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.put<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, comment, options);
  }

  delete(commentId: string, withUser: boolean = false, withArticle: boolean = false): Observable<CommentModel | CommentWithUserModel | CommentWithArticleModel> {
    const URL = `${this.baseCommentUrl}/${commentId}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.delete<CommentModel | CommentWithUserModel | CommentWithArticleModel>(URL, options);
  }


  getOfArticle(_idOfArticle: string, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel>> {
    const URL = `${this.baseCommentUrl}/ofArticle/${_idOfArticle}`;

    const options = this.constructOptions({ withUser, withArticle });

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel>>(URL, options);
  }


  count(comments: Array<CommentWithUserModel>): number {
    if (!comments || comments.length === 0) {
      return 0;
    }

    let count = 0;
    comments.filter(c => !c.deleted).forEach(c => {
      count++;
      // リプライは論理削除がないのでそのまま加算する
      if (c.replies && c.replies.length > 0) {
        count += c.replies.length;
      }
    });

    return count;
  }

  private constructOptions(httpOption: HttpOption): {params: HttpParams, headers: HttpHeaders} {
    const headers = this.jwtService.getHeaders();
    let params = new HttpParams();

    if (httpOption.condition) {
      params = params.set('condition', JSON.stringify(httpOption.condition));
    }

    if (httpOption.withUser) {
      params = params.set('withUser', 'true');
    }

    if (httpOption.withArticle) {
      params = params.set('withArticle', 'true');
    }

    return { headers, params };
  }
}
