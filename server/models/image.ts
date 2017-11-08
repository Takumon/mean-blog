import * as mongoose from 'mongoose';
import '../connection';

export enum ImageType {
  AVATOR = 100,
  PROFILE_BACKGROUND = 200,
  OF_ARTICLE = 300,
}


// ユーザアイコンは容量が大きいためユーザ情報とは別管理する
const ImageSchema = new mongoose.Schema({
  // 記事関連の画像の場合authorは未定義
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: Number,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
});

const Image = mongoose.model('Image', ImageSchema);

export { Image };
