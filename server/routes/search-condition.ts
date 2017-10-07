import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';

import { SearchCondition } from '../models/search-condition';

const COSTOME_RANGE: String = '6';
const searchConditionRouter: Router = Router();

// 複数件検索
searchConditionRouter.get('/', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
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
searchConditionRouter.get('/:_id', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
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
searchConditionRouter.post('/', (req, res, next) => {
  const searchCondition = new SearchCondition(req.body);
  if (searchCondition.dateSearchPattern === COSTOME_RANGE) {
    if (req.body.dateFrom) {
      searchCondition.dateFrom = new Date(req.body.dateFrom);
    }

    if (req.body.dateTo) {
      searchCondition.dateTo = new Date(req.body.dateTo);
    }
  }

  searchCondition.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '検索条件を登録しました。',
      obj: result
    });
  });
});

// 更新（差分更新）
searchConditionRouter.put('/:_id', (req, res, next) => {
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

  SearchCondition.update({
    _id: new mongoose.Types.ObjectId(req.params._id),
  }, model, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '検索条件を更新しました。',
      obj: result
    });
  });
});


// 削除
searchConditionRouter.delete('/:_id', (req, res, next) => {
  SearchCondition.findOne({
    _id: new mongoose.Types.ObjectId(req.params._id),
  }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした検索条件(_id=${req.params._id})が見つかりませんでした。',
        error: err.message
      });
    }

    model.remove(err2 => {
      if (err2) {
        return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
        });
      }

      return res.status(200).json({
        message: '検索条件を削除しました。',
      });
    });
  });
});

export { searchConditionRouter };
