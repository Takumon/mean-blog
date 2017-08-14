import { UserModel } from '../../users/shared/user.model';
import { CommentWithUserModel } from './comment-with-user.model';

export class ArticleWithUserModel {
  articleId: number;
  title: string;
  body: string;
  isMarkdown: boolean;
  date: string;
  author: UserModel;
  comments: Array<CommentWithUserModel>;
}
