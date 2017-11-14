import { CommentModel } from './comment.model';
import { ImageModel } from '../../shared/models/image.model';

export class ArticleModel {
  _id: string;
  title: string;
  body: string;
  isMarkdown: boolean;
  author: string;
  comments: Array<CommentModel>;
  image: Array<ImageModel>;
  created: string;
  updated: string;
  deleted: string;
}

