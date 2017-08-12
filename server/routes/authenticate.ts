import * as http from 'http';
import { Router, Response } from 'express';
import { User } from '../models/user';
import * as jwt from 'jsonwebtoken';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';
import { authenticate } from '../middleware/authenticate';
import * as jdenticon from 'jdenticon';

const authenticateRouter: Router = Router();

authenticateRouter.post('/check-state',  authenticate.verifyToken, (req, res) => {
  res.send({
    success: true,
    message: '認証成功'
  });
});

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

    // TODO パスワードの暗号化
    if (user.password !== reqUser.password) {
      res.json({
        success: false,
        message: '認証に失敗しました。'
      });
      return;
    }

    const token = jwt.sign(user, SECRET, {
      expiresIn: TOKEN_EFFECTIVE_SECOND
    });

    res.json({
      user: user,
      success: true,
      message: '認証成功',
      token: token,
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
    // TOOD 暗号化
    newUser.password = reqUser.password;
    newUser.save( (err2) => {
      if (err2) {
        throw err2;
      }

      const token = jwt.sign(newUser, SECRET, {
        expiresIn : TOKEN_EFFECTIVE_SECOND
      });

      return res.send({
        user: newUser,
        success: true,
        message: 'ユーザ情報を新規作成しました。',
        token: token
      });
    });
  });
});


export { authenticateRouter };
