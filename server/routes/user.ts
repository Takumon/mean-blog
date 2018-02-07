import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import * as multer from 'multer';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { User, UserDocument } from '../models/user.model';
import { Image, ImageType } from '../models/image.model';
import { PasswordManager } from '../helpers/password-manager';
import { validateHelper as v } from '../helpers/validate-helper';
import { MappedError } from 'express-validator/shared-typings';
import { sysError, multiReadSuccess, notFoundError, singleReadSuccess, validationError, cudSuccess } from '../helpers/response-util';

const MODEL_NAME = 'ユーザ';
const router: Router = Router();

// TODO ページング処理
/**
 * 指定した検索条件でユーザを複数件検索
 */
router.get('/', (req, res, next) => {
  const query = req.query;
  // 削除記事は除外
  const condition = {
    deleted: { $eq: null}
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

  function cb(err, users: UserDocument[]) {
    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return multiReadSuccess<UserDocument>(res, users);
  }
});

/**
 * 指定したID(_idではなくuserId)のユーザを検索
 */
router.get('/:userId', (req, res, next) => {
  const condition = {
    userId: req.params.userId,
    deleted: { $eq: null} // 削除記事は除外
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

  function cb(err, users: UserDocument[]) {
    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    if (!users || !users[0]) {
      return notFoundError(res, {
        title: `ユーザ(userId=${req.params.userId})が見つかりませんでした。`,
      });
    }

    return singleReadSuccess<UserDocument>(res, users[0]);
  }
});

// 入力チェック用
function isNotExisted(_id: String): Promise<boolean> {
  return User
  .findOne({ _id: _id, deleted: { $eq: null} })
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
  .findOne({ _id: _id, deleted: { $eq: null} })
  .exec()
  .then(user => {
    // 削除されてないユーザが存在すればOK
    if (user && !user.deleted) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }).catch(err => Promise.reject(false));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: multer.memoryStorage() });

export interface MulterFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
}

/**
 * ユーザを更新（差分更新）
 */
router.put('/:_id', upload.fields([
  { name: 'avator', maxCount: 1 },
  { name: 'profileBackground', maxCount: 1 }
]), [
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotExisted).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザ'])),
  check('email').optional({ checkFalsy : true})
    .isLength({ max: 50 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['Eメール', '50']))
    .isEmail().withMessage(v.message(v.MESSAGE_KEY.pattern_email, ['Eメール'])),
  check('userName').optional({ checkFalsy : true})
    .isLength({ max: 50 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['ユーザ名', '30'])),
  check('blogTitle').optional({ checkFalsy : true})
    .isLength({ max: 30 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['名', '30'])),
  check('userDescription').optional({ checkFalsy : true})
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['名', '30'])),
], (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  // アバターがリクエストで送信されてなければ次に進む
  if (!req.files['avator'] || !req.files['avator'][0]) {
    return updateProfileBackground(req, res);
  }

  // アバター更新
  const avatorFile = req.files['avator'][0];
  const condition = {
    author: new mongoose.Types.ObjectId(req.params._id),
    type: ImageType.AVATOR,
  };
  const avator = {
    author: new mongoose.Types.ObjectId(req.params._id),
    data: avatorFile.buffer,
    contentType: avatorFile.mimetype,
    filename: avatorFile.filename,
    type: ImageType.AVATOR,
  };


  Image.findOneAndUpdate(condition, avator, {upsert: true, new: true}, (err, updatedAvator ) => {

    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    updateProfileBackground(req, res);
  });
});


/**
 * プロフィール背景画像を更新
 *
 * @param req
 * @param res
 */
function updateProfileBackground(req, res) {
  // プロフィール背景がない場合はユーザモデルの更新のみ
  if (!req.files['profileBackground'] || !req.files['profileBackground'][0]) {
    return updateUser(req, res);
  }

  // プロフィール画像を更新
  const profileBackgroundFile = req.files['profileBackground'][0];
  const condition = {
    author: new mongoose.Types.ObjectId(req.params._id),
    type: ImageType.PROFILE_BACKGROUND,
  };
  const profileBackground = {
    author: new mongoose.Types.ObjectId(req.params._id),
    data: profileBackgroundFile.buffer,
    contentType: profileBackgroundFile.mimetype,
    filename: profileBackgroundFile.filename,
    type: ImageType.PROFILE_BACKGROUND,
  };

  Image.findOneAndUpdate(condition, profileBackground, {upsert: true, new: true }, (err, updatedProfileBackground ) => {

    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    updateUser(req, res);
  });
}

/**
 * ユーザ更新（差分更新）
 */
function updateUser(req, res) {
  const user = {
    blogTitle: req.param('blogTitle'),
    email: req.param('email'),
    userName: req.param('userName'),
    userDescription: req.param('userDescription'),
    updated: new Date()
  };

  User.findByIdAndUpdate(req.params._id, user, {new: true}, (err, newUser: UserDocument) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない
    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return cudSuccess<UserDocument>(res, {
      message: `${MODEL_NAME}を更新しました。`,
      obj: newUser
    });
  });
}



/**
 * 指定したユーザを削除（論理削除）
 */
router.delete('/:_id', [
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotDeleted).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザ'])),
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const sysdate = new Date();
  User.findByIdAndUpdate(req.params._id, { $set: { updated: sysdate, deleted: sysdate } }, {new: true}, (err, deletedUser: UserDocument) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない
    if (err) {
      return sysError(res, {
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return cudSuccess<UserDocument>(res, {
      message: `${MODEL_NAME}を削除しました。`,
      obj: deletedUser,
    });
  });
});

export { router as userRouter };
