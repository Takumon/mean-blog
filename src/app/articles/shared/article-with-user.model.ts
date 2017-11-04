import { UserModel } from '../../users/shared/user.model';

import { CommentWithUserModel } from './comment-with-user.model';
import { CommentModel } from './comment.model';

export class ArticleWithUserModel {
  _id: string;
  title: string;
  body: string;
  isMarkdown: boolean;
  author: UserModel;
  vote: Array<UserModel>;
  comments: Array<CommentWithUserModel>;
  newComment: CommentModel;
  created: string;
  updated: string;
  deleted: string;
  // 表示制御用
  showDetail: boolean;
}
