import { ArticleWithUserModel } from './article-with-user.model';

export class CommentWithArticleModel {
  _id: string;
  articleId: ArticleWithUserModel;
  text: string;
  parentId: string;
  user: string;
  created: string;
  updated: string;
  deleted: string;
}
