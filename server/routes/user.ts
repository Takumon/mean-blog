import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';

import { User } from '../models/user';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';

const userRouter: Router = Router();

// 複数件検索
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
  // TODO 検索条件が必要なら追加
  // 削除記事は除外
  const factors: Array<Object> = [];
  factors.push({
    deleted: { $exists : false }
  });

  const condition = {$match: {
    $and: factors
  }};

  if (query.withPassword) {
    // TODO 管理者権限チェック
    User
      .find(condition)
      .exec(cb);
  } else {
    User
      .find(condition)
      .select('-password')
      .exec(cb);
  }
});

// 1件検索
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

  const condition = {
    userId: req.params.userId,
    deleted: { $exists : false } // 削除記事は除外
  };

  if (req.query.withPassword) {
    // TODO 管理者権限チェック
    User
      .find(condition)
      .exec(cb);
  } else {
    User
      .find(condition)
      .select('-password')
      .exec(cb);
  }
});

// 更新（差分更新）
userRouter.put('/:userId', (req, res, next) => {
  const user = req.body;
  user.updated = new Date();

  User.update({
    userId: req.params.userId
  }, {$set: user }, (err, result) => {

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


// 削除
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
        message: 'ユーザを削除しました。',
      });
    });
  });
});

export { userRouter };
