import { UserModel } from '../../users/shared/user.model';
import { CommentWithUserModel } from './comment-with-user.model';
import { CommentModel } from './comment.model';

export class ArticleWithUserModel {
  _id: string;
  articleId: number;
  title: string;
  body: string;
  isMarkdown: boolean;
  date: string;
  author: UserModel;
  comments: Array<CommentWithUserModel>;
  newComment: CommentModel;

  // 表示制御用
  showCommentDetail: boolean;
}
