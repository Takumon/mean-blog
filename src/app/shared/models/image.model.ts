export class ImageModel {
  _id: string;
  author: string;
  type: number;
  data: string;
  contentType: string;
  fileName: string;
}

export enum ImageType {
  AVATOR = 100,
  PROFILE_BACKGROUND = 200,
  OF_ARTICLE = 300,
}

