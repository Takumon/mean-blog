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

const authenticateRouter: Router = Router();

authenticateRouter.post('/login', (req, res) => {

  const reqUser = req.body;
  User.findOne({
    userId: reqUser.userId,
    deleted: { $exists : false }
  }, function(err, user) {
    if (err) {
      throw err;
    }

    if (!user) {
      res.json({
        success: false,
        message: '認証に失敗しました。'
      });
      return;
    }

    if (!PasswordManager.compare(reqUser.password, user.password)) {
      res.json({
        success: false,
        message: '認証に失敗しました。'
      });
      return;
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


authenticateRouter.post('/register', [
  body('userId').exists().withMessage('ユーザIDを入力してください'),
  body('userId').isLength({ min: 6 }).withMessage('ユーザIDは6桁以上にしてください'),
  body('userId').isLength({ max: 30 }).withMessage('ユーザIDは30桁以下にしてください'),
  body('userId').matches(/^[a-zA-Z\d]*$/).withMessage('ユーザIDは半角英数字で入力してください'),
], (req, res) => {
  const errors = validationResult(req);
  console.log( errors.mapped());
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const reqUser = req.body;
  User.findOne({
    userId: reqUser.userId,
    deleted: { $exists : false }
  }, (err, user) => {
    if (err) {
      throw err;
    }

    if (user) {
      return res.status(400).send({
        success: false,
        message: ['指定したユーザIDは既に使用されています。']
      });
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
