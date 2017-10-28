import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';
import { check, oneOf, body, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

import { User } from '../models/user';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';
import { validateHelper as v } from '../helpers/validate-helper';

const authenticateRouter: Router = Router();

authenticateRouter.post('/login', [
  body('userId')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['ユーザID'])),
  body('password')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['パスワード'])),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const reqUser = req.body;
  User.findOne({
    userId: reqUser.userId,
    deleted: { $exists : false }
  }, function(err, user) {
    if (err) {
      throw err;
    }

    if (!user) {
      console.log('ユーザが存在しません');
      return res.status(400).json({ errors: [{param: 'common', msg: v.message(v.MESSAGE_KEY.login_error)}] });
    }

    if (!PasswordManager.compare(reqUser.password, user.password)) {
      console.log('パスワードが正しくありません');
      return res.status(400).json({ errors: [{param: 'common', msg: v.message(v.MESSAGE_KEY.login_error)}] });
    }

    const token = jwt.sign({ _id: user._id }, SECRET, {
      expiresIn: TOKEN_EFFECTIVE_SECOND
    });

    // パスワードはクライアント側に送信しない
    deleteProp(user, 'password');

    res.json({
      success: true,
      message: '認証成功',
      token: token,
      user: user,
    });
  });
});

function isAllreadyUsed(userId: String): Promise<boolean> {
  return User
  .findOne({ userId: userId, deleted: { $exists : false }})
  .exec()
  .then(user => {
    if (user) {
      return Promise.reject(true);
    }
    // チェックOK
    return Promise.resolve(true);
  }).catch(err => Promise.reject(false));
}

authenticateRouter.post('/register', [
  body('userId')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['ユーザID']))
    .isLength({ min: 6 }).withMessage(v.message(v.MESSAGE_KEY.minlength, ['ユーザID', '6']))
    .isLength({ max: 30 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['ユーザID', '30']))
    .matches(v.PATTERN.HANKAKUEISU).withMessage(v.message(v.MESSAGE_KEY.pattern_hankakueisuji, ['ユーザID']))
    .custom(isAllreadyUsed).withMessage(v.message(v.MESSAGE_KEY.allready_existed, ['ユーザID'])),
  body('password')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['パスワード']))
    .matches(v.PATTERN.PASSWORD).withMessage(v.message(v.MESSAGE_KEY.pattern_password, ['パスワード'])),
  body('confirmPassword')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['確認用パスワード']))
    .custom((value, {req}) => value === req.body.password).withMessage(v.message(v.MESSAGE_KEY.different, ['パスワード', '確認用パスワード'])),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const reqUser = req.body;
  User.findOne({
    userId: reqUser.userId,
    deleted: { $exists : false }
  }, (err, user) => {
    if (err) {
      throw err;
    }

    const newUser = new User();
    newUser.userId = reqUser.userId;
    newUser.icon = jdenticon.toPng(reqUser.userId, 200).toString('base64');
    newUser.password = PasswordManager.crypt(reqUser.password);

    newUser.save( (err2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: `ユーザ情報の登録に失敗しました。`,
        });
      }

      const token = jwt.sign({ _id: newUser._id }, SECRET, {
        expiresIn : TOKEN_EFFECTIVE_SECOND
      });

      // パスワードはクライアント側に送信しない
      deleteProp(newUser, 'password');

      return res.send({
        success: true,
        message: 'ユーザ情報を新規作成しました。',
        token: token,
        user: newUser,
      });
    });
  });
});


authenticateRouter.get('/check-state', (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(403).send({
      success: false,
      message: 'トークンが存在しません。'
    });
    return;
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || !decoded._id) {
      return res.status(403).json({
        success: false,
        message: 'トークン認証に失敗しました。'
      });
    }

    User
      .find({
        _id: decoded._id,
        deleted: { $exists : false }
      })
      .select('-password')
      .exec( (err2, doc) => {
        if (err2) {
          return res.status(403).json({
            success: false,
            message: 'ログインユーザ情報が取得できませんでした。',
          });
        }

        if (!doc[0]) {
          return res.status(403).json({
            success: false,
            message: 'ログインユーザ情報が取得できませんでした。',
          });
        }

        return res.send({
          success: true,
          message: '認証成功',
          token: token,
          user: doc[0],
        });
      });

  });
});

/**
 * delete演算子の代役
 * deleteだとプロパィが削除できないので
 * 回避策としてundefinedを代入する（値がundefinedの場合プロパティ自体レスポンスに定義されない）
 *
 * @param obj
 * @param propertyName
 */
function deleteProp(obj: Object, propertyName: string) {
  if (propertyName in obj) {
    obj[propertyName] = undefined;
  }
}

export { authenticateRouter };
