import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { Comment } from '../models/comment';
import { CommentTree } from '../helpers/comment-tree';
import { User } from '../models/user';

const commentRouter: Router = Router();


// 複数件検索
commentRouter.get('/', (req, res, next) => {

  getCondition(req, function(error, condition) {
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
    const withArticle: boolean = !!req.query.withArticle;
    if (withUser) {
      if (withArticle) {
        Comment
        .find(condition)
        .populate('user', '-password')
        .populate({
          path: 'articleId',
          populate: {
            path: 'author',
            select: '-password',
          }
        })
        .exec(cb);
      } else {
        Comment
        .find(condition)
        .populate('user', '-password')
        // .populate({
        //   path: 'articleId',
        //   populate: {
        //     path: 'author',
        //     select: '-password',
        //   }
        // })
        .exec(cb);
      }
    } else {
      if (withArticle) {
        Comment
        .find(condition)
        // .populate('user', '-password')
        .populate({
          path: 'articleId',
          populate: {
            path: 'author',
            select: '-password',
          }
        })
        .exec(cb);
      } else {
        Comment
        .find(condition)
        // .populate('user', '-password')
        // .populate({
        //   path: 'articleId',
        //   populate: {
        //     path: 'author',
        //     select: '-password',
        //   }
        // })
        .exec(cb);
      }
    }
  });
});


// 検索条件にauthorUserIdの指定がある場合はユーザ情報を取得して_idに変換する
function getCondition(req: any, cb: Function): void {
  const query = req.query;
  const source = query.condition ?
    JSON.parse(query.condition) :
    {};

  // 削除記事は除外
  const condition = {
    deleted: { $exists : false }
  };

  const userIds = source.user && source.user.userId;
  if (userIds) {
    let userFindCondition;
    if (userIds instanceof Array) {
      userFindCondition = {
        userId: {
          $in: userIds
        }
      };
    } else {
      userFindCondition = {
        userId: userIds
      };
    }

    return User.find(userFindCondition, function (err, users) {
      if (err) {
        return cb(err, null);
      }

      if (!users || !users.length) {
        return cb(new mongoose.Error(`指定したユーザ(${userIds})が見つかりません`), null);
      }

      condition['user']  = {
          $in: users.map(user => user._id)
      };

      return cb(null, condition);
    });
  }


  const _ids = source.user && source.user._id;
  if (_ids) {
    if (_ids instanceof Array) {
      condition['user'] = {
        $in: _ids.map(id =>  new mongoose.Types.ObjectId(id))
      };
    } else {
      condition['user'] =  new mongoose.Types.ObjectId(_ids);
    }
  }

  return cb(null, condition);
}


// 登録
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

// 更新（差分更新）
commentRouter.put('/:commentId', (req, res, next) => {
  const comment = req.body;
  comment.updated = new Date();

  Comment.update({
    _id: req.params.commentId
  }, {$set: comment}, (err, result) => {

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
