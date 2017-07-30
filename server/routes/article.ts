import * as http from 'http';
import { Router, Response } from 'express';
import { Article } from '../models/article';

const articleRouter: Router = Router();

// 全記事を取得する
articleRouter.get('/', (req, res, next) => {
  Article.find(function(err, doc) {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  });
});

// 指定したIDの記事を取得する
articleRouter.get('/:id', (req, res, next) => {

  Article.find({ articleId: +req.params.id }, function(err, doc) {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc[0]);
  });
});

// 記事を登録する
articleRouter.post('/', (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    body: req.body.body,
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

articleRouter.put('/:id', (req, res, next) => {
  Article.update({
    articleId: req.params.id
  }, req.body, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を更新しました。',
      obj: result
    });
  });
});

export { articleRouter };
