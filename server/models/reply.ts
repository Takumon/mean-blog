import * as mongoose from 'mongoose';
import {connection} from '../connection';

// コメントに対する返事
// リプライにリプライはできない仕様(ロジックを複雑にしないため)
// 物理削除可能
const ReplySchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Reply = mongoose.model('Reply', ReplySchema);

export { Reply };
