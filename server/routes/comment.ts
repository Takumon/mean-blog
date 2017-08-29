import * as http from 'http';
import { Router, Response } from 'express';
import { Comment } from '../models/comment';

const commentRouter: Router = Router();


// 全コメントを取得する
commentRouter.get('/', (req, res, next) => {
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
    Comment
      .find(condition)
      .populate('user', '-password')
      .exec(cb);
  } else {
    Comment
      .find(condition)
      .exec(cb);
  }
});

// コメントを登録する
commentRouter.post('/', (req, res, next) => {
  const comment = new Comment(req.body);

  comment.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'コメントを登録しました。',
      obj: result
    });
  });
});

// コメントを更新する
commentRouter.put('/:commentId', (req, res, next) => {
  console.log(req.params.commentId);
  console.log(req.body);

  Comment.update({
    _id: req.params.commentId
  }, req.body, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'コメントを更新しました。',
      obj: result
    });
  });
});


// 指定したIDのコメントを削除する
commentRouter.delete('/:commentId', (req, res, next) => {
  Comment.findOne({ _id: req.params.commentId }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとしたコメント(articleId=${req.params.id})が見つかりませんでした。',
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
        message: 'コメントを削除しました。',
      });
    });
  });
});

export { commentRouter };
