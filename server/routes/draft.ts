import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';

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

  let condition = {};
  const userIds = source && source.userId;
  if (userIds) {
    if (userIds instanceof Array) {
      condition = {
        author: {
          $in: userIds
        }
      };
    } else {
      condition = {
        author: userIds
      };
    }
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

    if (!doc[0]) {
      return res.status(500).json({
        title: `${MODEL_NAME}(_id=${req.params._id})が見つかりませんでした。`,
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
router.post('/', (req, res, next) => {
  const draft = new Draft(req.body);

  draft.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: DEFAULT_ERR_MSG,
          error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を登録しました。`,
      obj: result
    });
  });
});


// 更新（差分更新）
router.put('/:_id', (req, res, next) => {
  const draft = req.body;
  draft.updated = new Date();

  Draft.findByIdAndUpdate(req.params._id, {$set: draft }, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を更新しました。`,
      obj: result
    });
  });
});


// 物理削除
router.delete('/:_id', (req, res, next) => {
  Draft.findByIdAndRemove( new mongoose.Types.ObjectId(req.params._id), (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: result,
    });
  });
});


export { router as draftRouter };
