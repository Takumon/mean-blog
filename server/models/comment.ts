import * as mongoose from 'mongoose';
import {connection} from '../connection';

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
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
});

const Comment = mongoose.model('Comment', CommentSchema);

export { Comment };
