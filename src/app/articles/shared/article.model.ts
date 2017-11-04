import { CommentModel } from './comment.model';

export class ArticleModel {
  _id: string;
  title: string;
  body: string;
  isMarkdown: boolean;
  author: string;
  comments: Array<CommentModel>;
  // TODO 型は検討
  created: string;
  updated: string;
  deleted: string;
}

