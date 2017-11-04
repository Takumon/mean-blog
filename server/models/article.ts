import * as mongoose from 'mongoose';
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
}, { toJSON: { virtuals: true } });


ArticleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'articleId',
  justOne: false,
});

const Article = mongoose.model('Article', ArticleSchema);

export { Article };
