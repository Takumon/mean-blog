import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Comment } from '../models/comment';
import { User } from '../models/user';


const MODEL_NAME = 'コメント';
const router: Router = Router();

// 複数件検索
router.get('/', (req, res, next) => {

  getCondition(req, function(error, condition) {
    const cb = (err, doc) => {
      if (error) {
        return res.status(500).json({
          title: v.MESSAGE_KEY.default,
          error: error.message
        });
      }

      return res.status(200).json(doc);
    };


    const withUser: boolean = !!req.query.withUser;
    const withArticle: boolean = !!req.query.withArticle;
    if (withUser) {
      if (withArticle) {
        Comment
        .find(condition)
        .populate('user', '-password')
        .populate({
          path: 'articleId',
          populate: {
            path: 'author',
            select: '-password',
          }
        })
        .exec(cb);
      } else {
        Comment
        .find(condition)
        .populate('user', '-password')
        .exec(cb);
      }
    } else {
      if (withArticle) {
        Comment
        .find(condition)
        .populate({
          path: 'articleId',
          populate: {
            path: 'author',
            select: '-password',
          }
        })
        .exec(cb);
      } else {
        Comment
        .find(condition)
        .exec(cb);
      }
    }
  });
});


// 検索条件にauthorUserIdの指定がある場合はユーザ情報を取得して_idに変換する
function getCondition(req: any, cb: Function): void {
  const query = req.query;
  const source = query.condition ?
    JSON.parse(query.condition) :
    {};

  // 削除記事は除外
  const condition = {
    deleted: { $eq: null}
  };

  const userIds = source.user && source.user.userId;
  if (userIds) {
    let userFindCondition;
    if (userIds instanceof Array) {
      userFindCondition = {
        userId: {
          $in: userIds
        }
      };
    } else {
      userFindCondition = {
        userId: userIds
      };
    }

    return User.find(userFindCondition, function (err, users) {
      if (err) {
        return cb(err, null);
      }

      if (!users || !users.length) {
        return cb(new mongoose.Error(`指定したユーザ(${userIds})が見つかりません`), null);
      }

      condition['user']  = {
          $in: users.map(user => user._id)
      };

      return cb(null, condition);
    });
  }


  const _ids = source.user && source.user._id;
  if (_ids) {
    if (_ids instanceof Array) {
      condition['user'] = {
        $in: _ids.map(id =>  new mongoose.Types.ObjectId(id))
      };
    } else {
      condition['user'] =  new mongoose.Types.ObjectId(_ids);
    }
  }

  return cb(null, condition);
}


// 登録
router.post('/', [
  body('articleId')
    .exists().withMessage(v.message(v.MESSAGE_KEY.not_specified, ['コメント先の記事'])),
  body('articleId').optional()
    .custom(v.validation.isExistedArticle).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['コメント先の記事'])),
  body('text')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['コメント本文'])),
  body('text').optional()
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['コメント本文', '400'])),
  body('user')
    .exists().withMessage(v.message(v.MESSAGE_KEY.not_specified, ['コメント投稿者'])),
  body('user').optional()
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['コメント投稿者'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const comment = new Comment();
  comment.articleId = req.body.articleId;
  comment.text = req.body.text;
  comment.user = req.body.user;

  comment.save((err, target) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を登録しました。`,
      obj: target
    });
  });
});

// 更新（差分更新）
router.put('/:_id', [
  param('_id')
    .custom(v.validation.isExistedComment).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['コメント'])),
  body('text')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.not_existed, ['コメント本文'])),
  body('text').optional()
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['コメント本文', '400'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const comment: any = {};
  comment.text = req.body.text;
  comment.updated = new Date();

  Comment.findByIdAndUpdate(req.params._id, {$set: comment }, {new: true}, (err, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を更新しました。`,
      obj: target
    });
  });
});

// 論理削除
router.delete('/:_id', [
  param('_id')
    .custom(v.validation.isExistedComment).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['コメント'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sysdate = new Date();
  Comment.findByIdAndUpdate(req.params._id, {$set: {updated: sysdate, deleted: sysdate }}, {new: true}, (err, target) => {
    // 削除対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: target
    });
  });

});


// 記事に紐付くコメントを
// ツリー構造の順にソートしdepthを追加した配列にして取得する
router.get('/ofArticle/:_idOfArticle', [
  param('_idOfArticle')
  .custom(v.validation.isExistedArticle).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['URLの記事ID'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Comment
  .find({
    articleId: req.params._idOfArticle
  })
  .sort({ created: 1 })
  .populate([{
      path: 'user',
      select: 'icon userId userName',
    }, {
      path: 'replies',
      options: { sort: { created: 1 }},

      populate: {
        path: 'user',
        select: 'icon userId userName',
      }
  }])
  .exec((err, doc) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }
    return res.status(200).json(doc);
  });



});



export { router　as commentRouter };
