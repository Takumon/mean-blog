import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { JwtService } from '../../shared/services/jwt.service';

import { CommentModel } from './comment.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentWithArticleModel } from './comment-with-article.model';


@Injectable()
export class CommentService {
  private baseCommentUrl = '/api/comments';
  private baseReplyUrl = '/api/replies';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>> {
    const URL = this.baseCommentUrl;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
    if (withUser) {
      search.set('withUser', 'true');
    }
    if (withArticle) {
      search.set('withArticle', 'true');
    }

    return this.http
      .get(URL, { headers, search })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(comment: CommentModel): Observable<CommentModel> {
    const URL = this.baseCommentUrl;

    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .post(URL, comment, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  // 必ず差分更新とする
  update(comment: CommentModel): Observable<CommentModel> {
    const URL = `${this.baseCommentUrl}/${comment._id}`;

    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .put(URL, comment, options)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));

  }

  delete(commentId: String): Observable<CommentModel> {
    const URL = `${this.baseCommentUrl}/${commentId}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }


  getOfArticle(_idOfArticle: string, withUser: Boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel>> {
    const URL = `${this.baseCommentUrl}/ofArticle/${_idOfArticle}`;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
      .get(URL, { headers, search })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
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
}
