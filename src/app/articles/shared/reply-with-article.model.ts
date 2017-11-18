import { CommentWithArticleModel } from './comment-with-article.model';

export class ReplyWithArticleModel extends CommentWithArticleModel {
  commentId: string;
}
