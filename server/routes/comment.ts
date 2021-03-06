import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';


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

    let findFunction = Comment.find(condition);
    if (!!req.query.withUser) {
      findFunction = findFunction
      .populate('user', '-password');
    }

    if (!!req.query.withArticle) {
      findFunction = findFunction
        .populate({
          path: 'articleId',
          populate: {
            path: 'author',
            select: '-password',
          }
        });
    }

    findFunction.exec(cb);
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

  const userIds = source.user.userId;
  // ユーザIDの場合はユーザ検索して_idに変換する
  if (userIds) {
    const userFindCondition = userIds instanceof Array
      ? { userId: { $in: userIds }}
      : { userId: userIds };

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
    articleId: req.params._idOfArticle,
    deleted: {$eq: null},
  })
  .sort({ created: 1 })
  .populate([{
      path: 'user',
      select: 'userId userName deleted',
    }, {
      path: 'replies',
      options: { sort: { created: 1 }},

      populate: {
        path: 'user',
        select: 'userId userName deleted',
      }
  }])
  .exec((err, doc) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    // TODO 削除ユーザ除外処理はpopulateに持って行きたい
    // 削除ユーザのコメントを削除
    const comments = doc.filter(c => !c.user.deleted);
    // 削除ユーザのリプライを削除
    comments.filter(c => c.replies && c.replies.length > 0).forEach( (c, indexOfComments , commentsList) => {
      commentsList[indexOfComments].replies = c.replies.filter(r => !r.user.deleted);
    });

    return res.status(200).json(comments);
  });



});



export { router　as commentRouter };
