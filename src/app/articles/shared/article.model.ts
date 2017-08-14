import { CommentModel } from './comment.model';

export class ArticleModel {
  articleId: number;
  title: string;
  body: string;
  isMarkdown: boolean;
  date: Date;
  author: string;
  comments: Array<CommentModel>;
}
