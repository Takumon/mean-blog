import * as mongoose from 'mongoose';
import '../connection';

export enum ImageType {
  AVATOR = 100,
  PROFILE_BACKGROUND = 200
}


// ユーザアイコンは容量が大きいためユーザ情報とは別管理する
const ImageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
