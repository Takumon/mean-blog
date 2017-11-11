import { ImageModel } from '../../shared/models/image.model';

export class DraftModel {
  _id: string;
  title: string;
  body: string;
  isMarkdown: boolean;
  author: string;
  articleId: string;
  image: Array<ImageModel>;
  posted: boolean;
  created: string;
  updated: string;
}
