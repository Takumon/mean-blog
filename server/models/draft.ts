import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import '../connection';

// 下書き
const DraftSchema = new mongoose.Schema({
  // 記事モデルと同様のプロパティ
  title:  {
    type: String,
    required: [true, 'タイトルを入力してください。']
  },
  body: {
    type: String,
    required: [true, '本文を入力してください。']
  },
  isMarkdown: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  published: { type: Boolean, default: false},
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});


const Draft = mongoose.model('Draft', DraftSchema);

export { Draft };
