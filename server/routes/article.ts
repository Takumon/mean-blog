import * as http from 'http';
import { Router, Response } from 'express';

import { Article } from '../models/article';
import { Comment } from '../models/comment';


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

  const query = req.query;
  const condition = query.condition ?
    JSON.parse(query.condition) :
    {};

  if (query.withUser) {
    Article
      .find(condition)
      .populate('author', '-password')
      .exec(cb);
  } else {
    Article
      .find(condition)
      .exec(cb);
  }
});

// 指定したIDの記事を取得する
articleRouter.get('/:_id', (req, res, next) => {
  // 記事検索
  if (req.query.withUser) {
    Article
      .find({ _id: req.params._id })
      .populate('author', '-password')
      .exec(cbFind);
  } else {
    Article
      .find({ _id: req.params._id })
      .exec(cbFind);
  }

  function cbFind(err, doc): void {
    if (err) {
      return res.status(500).json({
        title: 'エラーが発生しました。',
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(500).json({
        title: `記事(articleId=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0]);
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
articleRouter.put('/:_id', (req, res, next) => {
  Article.update({
    _id: req.params._id
  }, {$set: req.body }, (err, result) => {

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
articleRouter.delete('/:_id', (req, res, next) => {
  Article.findOne({
    _id: req.params._id
  }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした記事(articleId=${req.params.id})が見つかりませんでした。',
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
