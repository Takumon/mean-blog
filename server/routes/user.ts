import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';

import { User } from '../models/user';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';

const userRouter: Router = Router();

userRouter.get('/', (req, res, next) => {
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

  if (query.withPassword) {
    // TODO 管理者権限チェック
    User
      .find(condition);
  } else {
    User
      .find(condition)
      .select('-password')
      .exec(cb);
  }
});

// 指定したIDの記事を取得する
userRouter.get('/:userId', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc[0]);
  };

  const condition = { userId: req.params.userId };

  if (req.query.withPassword) {
    // TODO 管理者権限チェック
    User
      .find(condition);
  } else {
    User
      .find(condition)
      .select('-password')
      .exec(cb);
  }
});

// ユーザ情報を更新する（差分更新）
userRouter.put('/:userId', (req, res, next) => {
  User.update({
    userId: req.params.userId
  }, {$set: req.body }, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'ユーザを更新しました。',
      obj: result
    });
  });
});


// ユーザ情報を削除する
userRouter.delete('/:userId', (req, res, next) => {
  User.findOne({
    userId: req.params.userId
  }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとしたユーザ情報(userId=${req.params.userId})が見つかりませんでした。',
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

export { userRouter };
