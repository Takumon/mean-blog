import * as http from 'http';
import { Router, Response } from 'express';
import { User } from '../models/user';
import * as jwt from 'jsonwebtoken';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';

const authenticateRouter: Router = Router();

// 認証API
authenticateRouter.post('/', (req, res) => {

  User.findOne({
    userId: req.body.userId
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
    if (user.password !== req.body.password) {
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
      success: true,
      message: '認証成功',
      token: token
    });
  });
});


export { authenticateRouter };
