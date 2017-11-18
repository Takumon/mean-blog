import { UserModel } from '../../users/shared/user.model';
import { ArticleWithUserModel } from './article-with-user.model';

export class CommentWithArticleModel {
  _id: string;
  articleId: ArticleWithUserModel;
  text: string;
  user: UserModel;
  created: string;
  updated: string;
  deleted: string;
}
