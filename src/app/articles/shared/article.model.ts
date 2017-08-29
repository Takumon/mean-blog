import { CommentModel } from './comment.model';

export class ArticleModel {
  _id: string;
  articleId: number;
  title: string;
  body: string;
  isMarkdown: boolean;
  date: Date;
  author: string;
  comments: Array<CommentModel>;
}

