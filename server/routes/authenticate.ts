import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';

import { User } from '../models/user';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';

const authenticateRouter: Router = Router();

authenticateRouter.post('/login', (req, res) => {

  const reqUser = req.body;
  User.findOne({
    userId: reqUser.userId
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


authenticateRouter.post('/register', (req, res) => {
  const reqUser = req.body;

  User.findOne({ 'userId': reqUser.userId }, (err, user) => {
    if (err) {
      throw err;
    }

    if (user) {
      return res.send({
        success: false,
        message: '指定したuserIdは既に使用されています。'
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
      .find({ _id: decoded._id })
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
            message: 'ログインユーザ情報が削除された可能性があります。',
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
