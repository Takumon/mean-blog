import * as mongoose from 'mongoose';
import {connection} from '../connection';

// コメントは記事に対してのみ
// コメントに対するコメントReplyという別モデルで管理
const CommentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  text: {
    type: String,
    required: [true, 'コメントを入力してください。']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  deleted: { type: Date, default: null }, // リプライがついていた時を考慮して物理削除しない
}, { toJSON: { virtuals: true } });

CommentSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'commentId',
  justOne: false,
});

const Comment = mongoose.model('Comment', CommentSchema);

export { Comment };
