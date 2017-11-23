import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Draft } from '../models/draft.model';
import { User } from '../models/user.model';


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
  .populate('image', '_id filename')
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
  if ( !req.params._id ||  !req.params._id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      title: `下書き(_id=${req.params._id})が見つかりませんでした。`,
    });
  }

  const condition = {
    _id: new mongoose.Types.ObjectId(req.params._id),
    deleted: { $eq: null}  // 削除記事は除外
  };

  Draft
  .find(condition)
  .populate('image', '_id filename')
  .exec((err, doc) => {
    if (err) {
      return res.status(500).json({
        title: DEFAULT_ERR_MSG,
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(400).json({
        title: `${MODEL_NAME}(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0]);
  });
});



// 登録
router.post('/', [
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['タイトル', '100'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['本文']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['本文', '10000'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザ']))
    .custom(v.validation.maxDraftCount).withMessage(v.message(v.MESSAGE_KEY.max_register_count, ['下書き', '10'])),
  body('articleId')
    .custom(v.validation.isArticleAuthorEqualsAuthor).withMessage('投稿者が記事のユーザと一致しません'),
  body('image').optional()
    .custom(v.validation.isUniqueImageIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['検索条件のユーザ']))
    .custom(v.validation.isExistedImageAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['検索条件のユーザ'])),
  ], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const draft = new Draft(req.body);

  if (req.body.image && req.body.image.length > 0) {
    draft.image = req.body.image;
  }


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
    .custom(v.validation.isExistedDraft).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['下書き'])),
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['タイトル', '100'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['本文']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['本文', '10000'])),
  body('image').optional()
    .custom(v.validation.isUniqueImageIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['画像']))
    .custom(v.validation.isExistedImageAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['画像'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 投稿者、参照先記事などは更新不可
  const model = {};
  const draft = {
    title: req.body.title,
    isMarkdown: req.body.isMarkdown,
    body: req.body.body,
    updated: new Date(),
  };
  model['$set'] = draft;

  if (req.body.image && req.body.image.length > 0) {
    draft['image'] = req.body.image;
  } else {
    model['$unset'] = { image: ''};
  }

  Draft.findByIdAndUpdate(req.params._id, model, {new: true}, (error, target) => {
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
    .custom(v.validation.isExistedDraft).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['下書き'])),
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
