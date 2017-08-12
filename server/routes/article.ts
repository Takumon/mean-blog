import * as http from 'http';
import { Router, Response } from 'express';
import { Article } from '../models/article';

const articleRouter: Router = Router();

// 全記事を取得する
articleRouter.get('/', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  };


  if (req.query.withUser) {
    Article
      .find()
      .populate('author', '-password')
      .exec(cb);
  } else {
    Article
      .find(cb);
  }
});

// 指定したIDの記事を取得する
articleRouter.get('/:id', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc[0]);
  };


  if (req.query.withUser) {
    Article
      .find({ articleId: +req.params.id })
      .populate('author', '-password')
      .exec(cb);
  } else {
    Article
      .find({ articleId: +req.params.id }, cb);
  }
});

// 記事を登録する
articleRouter.post('/', (req, res, next) => {
  const article = new Article(req.body);

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

// 記事を更新する
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

// 記事を削除する
articleRouter.delete('/:id', (req, res, next) => {
  Article.findOne({ articleId: req.params.id }, req.body, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした記事(articleId=${req.params.id})は見つかりませんでした。',
        error: err.message
      });
    }

    model.remove(err2 => {
      if (err2) {
        return res.status(500).json({
            title: 'エラーが発生しました。',
            error: err.message
        });
      }

      return res.status(200).json({
        message: '記事を削除しました。',
      });
    });
  });
});

export { articleRouter };
