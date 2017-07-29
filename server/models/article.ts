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
  // author: { type : mongoose.Schema.ObjectId, ref : 'User' },
  date: { type: Date, default: Date.now },
});

ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'articleId',
  startAt: 0
});

const Article = mongoose.model('Article', ArticleSchema);

export { Article };
