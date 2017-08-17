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
// TODO _idをuserIdに置き換える
userRouter.get('/:_id', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc[0]);
  };

  const condition = { _id: req.params._id };

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

export { userRouter };
