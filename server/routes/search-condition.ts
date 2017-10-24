import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { SearchCondition } from '../models/search-condition';

// TODO 日付期間はenum化
const COSTOME_RANGE: String = '6';
const MODEL_NAME = 'お気に入り検索条件';
const router: Router = Router();

// 複数件検索
router.get('/', (req, res, next) => {
  const cb = (error, doc) => {
    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: error.message
      });
    }
    return res.status(200).json(doc);
  };

  const query = req.query;
  // TODO 検索条件
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

  if (query.withPassword) {
    // TODO 管理者権限チェック
    SearchCondition
      .find(condition)
      .populate('users')
      .exec(cb);
  } else {
    SearchCondition
      .find(condition)
      .populate('users', '-password')
      .exec(cb);
  }
});


// 1件検索
router.get('/:_id', (req, res, next) => {
  const cb = (error, doc) => {
    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: error.message
      });
    }
    return res.status(200).json(doc[0]);
  };

  const withUser: boolean = !!req.query.withUser;
  const condition = {
    _id: new mongoose.Types.ObjectId(req.params._id),
  };

  if (withUser) {
    if (req.query.withPassword) {
      // TODO 管理者権限チェック
      SearchCondition
        .find(condition)
        .populate('users')
        .exec(cb);
    } else {
      SearchCondition
        .find(condition)
        .populate('users', '-password')
        .exec(cb);
    }
  } else {
      SearchCondition
        .find(condition)
        .exec(cb);
  }
});


// 登録
router.post('/', [
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['お気に入り検索条件名']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['お気に入り検索条件名', '100'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE.not_existed, ['ユーザ'])),
  body('users')
    .custom(v.validation.isUniqueUserIdList).withMessage(v.message(v.MESSAGE.not_unique, ['検索条件のユーザ']))
    .custom(v.validation.isExistedUserAll).withMessage(v.message(v.MESSAGE.not_existed, ['検索条件のユーザ'])),
  body('dateSearchPattern')
    .custom((value, {req}) => {
      // TODO リファクタ（定数化など）
      if (value === null || value === undefined) {
        return true;
      }
      if (value === '0'
        || value === '1'
        || value === '2'
        || value === '3'
        || value === '4'
        || value === '5'
        || value === '6'
      ) {
        return true;
      }

      if (value === '6') {
        return !!(req.param['dataTo'] || req.param['dataFrom']);
      }

      return false;
    }).withMessage('検索条件の投稿日の指定が正しくありません')
    .custom((value, {req}) => {
      // TODO リファクタ（定数化など）
      if (value === null || value === undefined) {
        return true;
      }

      if (value === '6') {
        return !!(req.param['dataTo'] || req.param['dataFrom']);
      }

      return false;
    }).withMessage('検索条件の投稿日を期間指定にする場合、開始日か終了日を指定してください'),

], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const searchCondition = new SearchCondition(req.body);
  if (searchCondition.dateSearchPattern === COSTOME_RANGE) {
    if (req.body.dateFrom) {
      searchCondition.dateFrom = new Date(req.body.dateFrom);
    }

    if (req.body.dateTo) {
      searchCondition.dateTo = new Date(req.body.dateTo);
    }
  }

  searchCondition.save((error, target) => {
    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
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
    .custom(v.validation.isExistedSearchCondition).withMessage(v.message(v.MESSAGE.not_existed, ['お気に入り検索条件'])),
    body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE.required, ['お気に入り検索条件名']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE.maxlength, ['お気に入り検索条件名', '100'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE.not_existed, ['ユーザ'])),
  body('users')
    .custom(v.validation.isUniqueUserIdList).withMessage(v.message(v.MESSAGE.not_unique, ['検索条件のユーザ']))
    .custom(v.validation.isExistedUserAll).withMessage(v.message(v.MESSAGE.not_existed, ['検索条件のユーザ'])),
  body('dateSearchPattern')
    .custom((value, {req}) => {
      // TODO リファクタ（定数化など）
      if (value === null || value === undefined) {
        return true;
      }
      if (value === '0'
        || value === '1'
        || value === '2'
        || value === '3'
        || value === '4'
        || value === '5'
        || value === '6'
      ) {
        return true;
      }

      if (value === '6') {
        return !!(req.param['dataTo'] || req.param['dataFrom']);
      }

      return false;
    }).withMessage('検索条件の投稿日の指定が正しくありません')
    .custom((value, {req}) => {
      // TODO リファクタ（定数化など）
      if (value === null || value === undefined) {
        return true;
      }

      if (value === '6') {
        return !!(req.param['dataTo'] || req.param['dataFrom']);
      }

      return false;
    }).withMessage('検索条件の投稿日を期間指定にする場合、開始日か終了日を指定してください'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  let model;
  const searchCondition = req.body;
  if (searchCondition.dateSearchPattern === COSTOME_RANGE) {
    if (req.body.dateFrom) {
      searchCondition.dateFrom = new Date(req.body.dateFrom);
    }

    if (req.body.dateTo) {
      searchCondition.dateTo = new Date(req.body.dateTo);
    }

    model = {$set: searchCondition };
  } else {
    // 期間指定からそれ以外のdateSearchPatternに変更した場合dateFromとdateToは削除する
    model = {
      $set: searchCondition,
      $unset: {
        dateFrom: '',
        dateTo: '',
      },
    };
  }

  SearchCondition.findByIdAndUpdate(req.params._id, model, {new: true}, (error, target) => {
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


// 削除
router.delete('/:_id', [
  param('_id')
    .custom(v.validation.isExistedSearchCondition).withMessage(v.message(v.MESSAGE.not_existed, ['お気に入り検索条件'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  SearchCondition.findByIdAndRemove( new mongoose.Types.ObjectId(req.params._id), (error, taget) => {

    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: error.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: taget,
    });
  });
});

export { router as searchConditionRouter };
