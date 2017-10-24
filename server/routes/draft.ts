import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Draft } from '../models/draft';
import { User } from '../models/user';


const MODEL_NAME = '下書き';
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

  Draft
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
    deleted: { $exists : false } // 削除記事は除外
  };

  Draft
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
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['タイトル', '100'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['本文']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['本文', '10000'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE.not_existed, ['ユーザ'])),
  body('articleId')
    .custom(v.validation.isArticleAuthorEqualsAuthor).withMessage('投稿者が記事のユーザと一致しません'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const draft = new Draft(req.body);

  draft.save((error, target) => {
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
  // 形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(v.validation.isExistedDraft).withMessage(v.message(v.MESSAGE.not_existed, ['下書き'])),
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['タイトル', '100'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['本文']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['本文', '10000'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 投稿者、参照先記事などは更新不可
  const draft = {
    title: req.body.title,
    isMarkdown: req.body.isMarkdown,
    body: req.body.body,
    updated: new Date(),
  };

  Draft.findByIdAndUpdate(req.params._id, {$set: draft }, {new: true}, (error, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
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
    .custom(v.validation.isExistedDraft).withMessage(v.message(v.MESSAGE.not_existed, ['下書き'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Draft.findByIdAndRemove( new mongoose.Types.ObjectId(req.params._id), (error, taget) => {

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


export { router as draftRouter };
