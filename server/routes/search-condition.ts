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
        title: v.MESSAGE_KEY.default,
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
        title: v.MESSAGE_KEY.default,
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


// 入力チェック処理
const isCollectedPattern = (value: string) => {
  if (!value) {
    return true;
  }
  return ['0', '1', '2', '3', '4', '5', '6'].indexOf(value) !== -1;
};
const isExistDateRange = (value: string, {req}) => {
  if (!value) {
    return true;
  }

  if (value === '6') {
    return !!(req.body['dateTo'] || req.body['dateFrom']);
  }

  return true;
};
const isCollectedDateRange = (value: string, {req}) => {
  if (!value) {
    return true;
  }

  // 期間指定ではない場合は指定範囲のチェックはしない
  if (value !== '6') {
    return true;
  }

  const dateFrom = req.body['dateFrom'];
  const dateTo = req.body['dateTo'];
  // 両方存在する場合のみ
  if (!dateFrom || !dateTo) {
    return true;
  }

  // どちらかが日付形式ではない場合は大小比較はできない
  if (!v.validation.isDate(dateFrom) || !v.validation.isDate(dateTo)) {
    return true;
  }

  return Date.parse(dateFrom) <= Date.parse(dateTo);
};


// 登録
router.post('/', [
  body('name')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['お気に入り検索条件名']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['お気に入り検索条件名', '100'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザ']))
    .custom(v.validation.maxSearchConditionCount).withMessage(v.message(v.MESSAGE_KEY.max_register_count, ['お気に入り検索条件', '10'])),
    body('users')
    .custom(v.validation.isUniqueUserIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['検索条件のユーザ']))
    .custom(v.validation.isExistedUserAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['検索条件のユーザ'])),
  body('dateSearchPattern')
    .custom(isCollectedPattern).withMessage('検索条件の投稿日の指定が正しくありません')
    .custom(isExistDateRange).withMessage('検索条件の投稿日を期間指定にする場合、開始日か終了日を指定してください')
    // TODO 相関チェックの場所
    .custom(isCollectedDateRange).withMessage(v.message(v.MESSAGE_KEY.date_range, ['終了日', '開始日'])),
  body('dateFrom').optional({checkFalsy: true})
    .custom(v.validation.isDate).withMessage(v.message(v.MESSAGE_KEY.pattern_date, ['開始日'])),
  body('dateTo').optional({checkFalsy: true})
    .custom(v.validation.isDate).withMessage(v.message(v.MESSAGE_KEY.pattern_date, ['終了日'])),
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
        title: v.MESSAGE_KEY.default,
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
// １ユーザ１０件まで
router.put('/:_id', [
  param('_id')
    .custom(v.validation.isExistedSearchCondition).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['お気に入り検索条件'])),
    body('name')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['お気に入り検索条件名']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['お気に入り検索条件名', '100'])),
  body('author')
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['ユーザ'])),
  body('users')
    .custom(v.validation.isUniqueUserIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['検索条件のユーザ']))
    .custom(v.validation.isExistedUserAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['検索条件のユーザ'])),
  body('dateSearchPattern')
    .custom(isCollectedPattern).withMessage('検索条件の投稿日の指定が正しくありません')
    .custom(isExistDateRange).withMessage('検索条件の投稿日を期間指定にする場合、開始日か終了日を指定してください')
    // TODO 相関チェックの場所
    .custom(isCollectedDateRange).withMessage(v.message(v.MESSAGE_KEY.date_range, ['終了日', '開始日'])),
  body('dateFrom').optional({checkFalsy: true})
    .custom(v.validation.isDate).withMessage(v.message(v.MESSAGE_KEY.pattern_date, ['開始日'])),
  body('dateTo').optional({checkFalsy: true})
    .custom(v.validation.isDate).withMessage(v.message(v.MESSAGE_KEY.pattern_date, ['終了日'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const set: any = {};
  const unset: any = {};

  set.name = req.body.name;
  set.updated = new Date();

  if (req.body.users || req.body.users.length > 0) {
    set.users = req.body.users;
  } else {
    unset.users = '';
  }

  if (['0', '1', '2', '3', '4', '5', '6'].indexOf(req.body.dateSearchPattern) === -1) {
    unset.dateSearchPattern = '';
  } else {
    set.dateSearchPattern = req.body.dateSearchPattern;
  }

  if (req.body.dateFrom) {
    set.dateFrom = new Date(req.body.dateFrom);
  } else {
    unset.dateFrom = '';
  }

  if (req.body.dateTo) {
    set.dateTo = new Date(req.body.dateTo);
  } else {
    unset.dateTo = '';
  }

  const model = {$set: set, $unset: unset };

  console.log(set);
  console.log(unset);

  SearchCondition.findByIdAndUpdate(req.params._id, model, {new: true}, (error, target) => {
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


// 削除
router.delete('/:_id', [
  param('_id')
    .custom(v.validation.isExistedSearchCondition).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['お気に入り検索条件'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  SearchCondition.findByIdAndRemove( new mongoose.Types.ObjectId(req.params._id), (error, taget) => {

    if (error) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
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
