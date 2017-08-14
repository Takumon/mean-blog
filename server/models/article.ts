import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import '../connection';

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'コメントを入力してください。']
  },
  isMarkdown: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

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
  comments: [ CommentSchema ],
  date: { type: Date, default: Date.now },
});

ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'articleId',
  startAt: 0
});

const Article = mongoose.model('Article', ArticleSchema);

export { Article };
