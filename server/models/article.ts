import * as mongoose from 'mongoose';

const Article = mongoose.model('articles', new mongoose.Schema({
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
}));

export { Article };
