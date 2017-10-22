import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';


import { User } from '../models/user';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';
import { validateHelper as v } from '../helpers/validate-helper';


const MODEL_NAME = 'ユーザ';
const userRouter: Router = Router();

// 複数件検索
userRouter.get('/', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }
    return res.status(200).json(doc);
  };

  const query = req.query;
  // 削除記事は除外
  const condition = {
    deleted: { $exists : false }
  };

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
        title: v.MESSAGE.default,
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

// 入力チェック用
function isNotExisted(_id: String): Promise<boolean> {
  return User
  .findOne({ _id: _id, deleted: { $exists : false }})
  .exec()
  .then(user => {
    if (user) {
      // チェックOK
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }).catch(err => Promise.reject(false));
}

// 入力チェック用
function isNotDeleted(_id: String): Promise<boolean> {
  return User
  .findOne({ _id: _id, deleted: { $exists : false }})
  .exec()
  .then(user => {
    // 削除されてないユーザが存在すればOK
    if (user && !user.deleted) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }).catch(err => Promise.reject(false));
}


// 更新（差分更新）
userRouter.put('/:_id', [
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotExisted).withMessage(v.message(v.MESSAGE.not_existed, ['ユーザ'])),
  body('email').optional({ checkFalsy : true})
    .isLength({ max: 50 }).withMessage(v.message(v.MESSAGE.maxlength, ['Eメール', '50']))
    .isEmail().withMessage(v.message(v.MESSAGE.pattern_email, ['Eメール'])),
  body('firstName').optional({ checkFalsy : true})
    .isLength({ max: 30 }).withMessage(v.message(v.MESSAGE.maxlength, ['氏', '30'])),
  body('lastName').optional({ checkFalsy : true})
    .isLength({ max: 30 }).withMessage(v.message(v.MESSAGE.maxlength, ['名', '30'])),
  body('blogTitle').optional({ checkFalsy : true})
    .isLength({ max: 30 }).withMessage(v.message(v.MESSAGE.maxlength, ['名', '30'])),
  body('userDescription').optional({ checkFalsy : true})
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE.maxlength, ['名', '30'])),
  body('icon').optional({ checkFalsy : true})
    .isBase64().withMessage(v.message(v.MESSAGE.pattern, ['アイコン画像', '画像ファイル'])),
  body('blogTitleBackground').optional({ checkFalsy : true})
    .isBase64().withMessage(v.message(v.MESSAGE.pattern, ['ブログタイトル画像', '画像ファイル'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = req.body;
  delete user.password;
  delete user.isAdmin;
  user.updated = new Date();

  User.findByIdAndUpdate(req.params._id, {$set: user }, {new: true}, (err, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を更新しました。`,
      obj: target
    });
  });
});


// 削除
userRouter.delete('/:_id', [
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotDeleted).withMessage(v.message(v.MESSAGE.not_existed, ['ユーザ'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sysdate = new Date();
  User.findByIdAndUpdate(req.params._id, { $set: { updated: sysdate, deleted: sysdate } }, {new: true}, (err, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: target,
    });
  });
});

export { userRouter };
