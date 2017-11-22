import * as http from 'http';
import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';
import { check, oneOf, body, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

import { User } from '../models/user';
import { Image, ImageType } from '../models/image';
import * as config from '../config';
import { authenticate } from '../middleware/authenticate';
import { PasswordManager } from '../helpers/password-manager';
import { validateHelper as v } from '../helpers/validate-helper';

const router: Router = Router();

router.post('/login', [
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
    deleted: { $eq: null}
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

    const token = jwt.sign({ _id: user._id }, config.SECRET, {
      expiresIn: config.TOKEN_EFFECTIVE_SECOND
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
  .findOne({ userId: userId, deleted: { $eq: null}})
  .exec()
  .then(user => {
    if (user) {
      return Promise.reject(true);
    }
    // チェックOK
    return Promise.resolve(true);
  }).catch(err => Promise.reject(false));
}

router.post('/register', [
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
    deleted: { $eq: null}
  }, (err, user) => {
    if (err) {
      throw err;
    }

    const newUser = new User();
    newUser.userId = reqUser.userId;
    newUser.password = PasswordManager.crypt(reqUser.password);


    newUser.save( (err2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: err2,
        });
      }

      const token = jwt.sign({ _id: newUser._id }, config.SECRET, {
        expiresIn : config.TOKEN_EFFECTIVE_SECOND
      });


      // アバター登録
      const avator = new Image({
        author: newUser._id,
        data: jdenticon.toPng(reqUser.userId, 200),
        contentType: 'image/png',
        fileName: `avator_${newUser.userId}.png`,
        type: ImageType.AVATOR,
      });


      avator.save((err3) => {
        if (err3) {
          return res.status(500).json({
            success: false,
            message: err3,
          });
        }

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
});


function isCollectPassword(password, {req}) {
  return User
  .findOne({ _id: req.body._id, deleted: { $eq: null}})
  .exec()
  .then(user => {
    if (user && PasswordManager.compare(password, user.password)) {
        return Promise.resolve(true);
    }
    return Promise.reject(false);
  }).catch(err => Promise.reject(false));
}


router.put('/changePassword', [
  body('_id')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['ユーザID']))
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザID'])),
  body('oldPassword')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['現在のパスワード']))
    .custom(isCollectPassword).withMessage(v.message(v.MESSAGE_KEY.invalid, ['現在のパスワード'])),
  body('newPassword')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['新しいパスワード']))
    .matches(v.PATTERN.PASSWORD).withMessage(v.message(v.MESSAGE_KEY.pattern_password, ['新しいパスワード']))
    .custom((value, {req}) => value !== req.body.oldPassword).withMessage(v.message(v.MESSAGE_KEY.same, ['現在のパスワード', '新しいパスワード'])),
  body('newConfirmPassword')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['新しいパスワード確認用']))
    .custom((value, {req}) => value === req.body.newPassword).withMessage(v.message(v.MESSAGE_KEY.different, ['新しいパスワード', '新しいパスワード確認用'])),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const model = {$set: {
    password: PasswordManager.crypt(req.body.newPassword),
    updated: new Date()
  }};

  User.findByIdAndUpdate(req.body._id, model, {new: true}, (err, target) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }
    // パスワードはクライアント側に送信しない
    deleteProp(target, 'password');

    return res.status(200).json({
      message: `パスワードを更新しました。`,
      obj: target
    });
  });
});


router.get('/check-state', (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(403).send({
      success: false,
      message: 'トークンが存在しません。'
    });
    return;
  }

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err || !decoded._id) {
      return res.status(403).json({
        success: false,
        message: 'トークン認証に失敗しました。'
      });
    }

    User
      .find({
        _id: decoded._id,
        deleted: { $eq: null}
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

export { router as authenticateRouter};
