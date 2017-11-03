import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Reply } from '../models/reply';
import { User } from '../models/user';


const MODEL_NAME = 'リプライ';
const DEFAULT_ERR_MSG = 'エラーが発生しました。';
const router: Router = Router();

// 複数件検索
router.get('/', (req, res, next) => {

  const query = req.query;
  const source = query.condition ?
    JSON.parse(query.condition) :
    {};

  const condition = {};
  const userIds = source && source.userId;
  if (userIds) {
    condition['author'] = userIds instanceof Array
      ? { $in: userIds }
      : userIds;
  }

  const articleIds = source && source.articleId;
  if (articleIds) {
    condition['articleId'] = articleIds instanceof Array
      ? { $in: articleIds }
      : articleIds;
  }

  Reply
  .find(condition)
  .exec((err, doc) => {
    if (err) {
      return res.status(500).json({
        title: DEFAULT_ERR_MSG,
        error: err.message
      });
    }

    return res.status(200).json(doc);
  });
});


// 一件検索
router.get('/:_id', (req, res, next) => {
  const condition = {
    _id: new mongoose.Types.ObjectId(req.params._id),
    deleted: { $eq: null}  // 削除記事は除外
  };

  Reply
  .find(condition)
  .exec((err, doc) => {
    if (err) {
      return res.status(500).json({
        title: DEFAULT_ERR_MSG,
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(500).json({
        title: `${MODEL_NAME}(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0]);
  });
});



// 登録
router.post('/', [
  body('articleId')
    .exists().withMessage(v.message(v.MESSAGE_KEY.not_specified, ['リプライ先の記事'])),
  body('articleId').optional()
    .custom(v.validation.isExistedArticle).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ先の記事'])),
  body('commentId')
    .exists().withMessage(v.message(v.MESSAGE_KEY.not_specified, ['リプライ先のコメント'])),
  body('commentId').optional()
    .custom(v.validation.isExistedComment).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ先のコメント'])),
  body('text')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['リプライ本文'])),
  body('text').optional()
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['リプライ本文', '400'])),
  body('user')
    .exists().withMessage(v.message(v.MESSAGE_KEY.not_specified, ['リプライ投稿者'])),
  body('user').optional()
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ投稿者'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const reply = new Reply();
  reply.articleId = req.body.articleId;
  reply.commentId = req.body.commentId;
  reply.text = req.body.text;
  reply.user = req.body.user;

  reply.save((error, target) => {
    if (error) {
      return res.status(500).json({
          title: DEFAULT_ERR_MSG,
          error: error.message
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
    .custom(v.validation.isExistedReply).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ'])),
  body('text')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ本文'])),
  body('text').optional()
    .isLength({ max: 400 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['リプライ本文', '400'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 投稿者、参照先記事などは更新不可
  const setModel: any = {};
  setModel.text = req.body.text;
  setModel.updated = new Date();

  Reply.findByIdAndUpdate(req.params._id, {$set: setModel }, {new: true}, (error, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (error) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: error.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を更新しました。`,
      obj: target
    });
  });
});


// 物理削除
router.delete('/:_id', [
  param('_id')
    .custom(v.validation.isExistedReply).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['リプライ'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Reply.findByIdAndRemove( new mongoose.Types.ObjectId(req.params._id), (error, taget) => {

    if (error) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: error.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: taget,
    });
  });
});


export { router as replyRouter };
