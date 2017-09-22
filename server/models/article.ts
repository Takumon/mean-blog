import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import '../connection';

const ArticleSchema = new mongoose.Schema({
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
  vote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  deleted: { type: Date },
});

ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'articleId',
  startAt: 0
});

const Article = mongoose.model('Article', ArticleSchema);

export { Article };
