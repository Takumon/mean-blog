import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { CommentModel } from './comment.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentWithArticleModel } from './comment-with-article.model';


@Injectable()
export class CommentService {
  private Constant = Constant;
  private baseCommentUrl = '/api/comments';
  private baseReplyUrl = '/api/replies';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  get(condition: Object, withUser: boolean = false, withArticle: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>> {
    const URL = this.baseCommentUrl;

    const headers = this.jwtService.getHeaders();
    let params = new HttpParams()
      .set('condition', JSON.stringify(condition));

    if (withUser) {
      params = params.set('withUser', 'true');
    }
    if (withArticle) {
      params = params.set('withArticle', 'true');
    }

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel> | Array<CommentWithArticleModel>>(URL, { headers, params });
  }

  register(comment: CommentModel): Observable<CommentModel> {
    const URL = this.baseCommentUrl;

    const headers: HttpHeaders = this.jwtService.getHeaders();

    return this.http.post<CommentModel>(URL, comment, { headers });
  }

  // 必ず差分更新とする
  update(comment: CommentModel): Observable<CommentModel> {
    const URL = `${this.baseCommentUrl}/${comment._id}`;

    const headers: HttpHeaders = this.jwtService.getHeaders();

    return this.http.put<CommentModel>(URL, comment, { headers });
  }

  delete(commentId: String): Observable<CommentModel> {
    const URL = `${this.baseCommentUrl}/${commentId}`;

    return this.http.delete<CommentModel>(URL, this.jwtService.getRequestOptions());
  }


  getOfArticle(_idOfArticle: string, withUser: boolean = false): Observable<Array<CommentModel> | Array<CommentWithUserModel>> {
    const URL = `${this.baseCommentUrl}/ofArticle/${_idOfArticle}`;

    const headers = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    return this.http.get<Array<CommentModel> | Array<CommentWithUserModel>>(URL, { headers, params });
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
