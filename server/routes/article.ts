import * as http from 'http';
import { Router, Response } from 'express';
import { Article } from '../models/article';

const articleRouter: Router = Router();

// 全てのメッセージを取得する
articleRouter.get('/', (req, res, next) => {
  Article.find(function(err, doc) {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({articles: doc});
  });
});

// メッセージを登録する
articleRouter.post('/', (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  });

  article.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を登録しました。',
      obj: result
    });
  });
});

export { articleRouter };
