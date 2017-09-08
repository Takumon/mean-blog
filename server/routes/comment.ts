import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { Comment } from '../models/comment';
import { CommentTree } from '../helpers/comment-tree';

const commentRouter: Router = Router();


// 複数件検索
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

// 単一検索
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

// 更新
commentRouter.put('/:commentId', (req, res, next) => {

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

// 論理削除
commentRouter.delete('/:commentId', (req, res, next) => {
  Comment.findOne({ _id: req.params.commentId }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとしたコメント(_id=${req.params.id})が見つかりませんでした。',
        error: err.message
      });
    }
    const sysdate = new Date();
    model.update({
      $set: {
        updated: sysdate,
        deleted: sysdate,
      }
    }, err2 => {
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


// 記事に紐付くコメントを
// ツリー構造の順にソートしdepthを追加した配列にして取得する
commentRouter.get('/ofArticle/:_idOfArticle', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  };


  const withUser: boolean = !!req.query.withUser;
  const _idOfArticle: mongoose.Types.ObjectId = mongoose.Types.ObjectId(req.params._idOfArticle);
  CommentTree.getCommentOfTree(_idOfArticle, withUser, cb);
});



export { commentRouter };
