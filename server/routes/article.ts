import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';


import { validateHelper as v } from '../helpers/validate-helper';
import { Article } from '../models/article';
import { Comment } from '../models/comment';
import { CommentTree } from '../helpers/comment-tree';
import { User } from '../models/user';

const MODEL_NAME = '記事';
const articleRouter: Router = Router();

// 複数件検索
articleRouter.get('/', (req, res, next) => {

  getCondition(req, function(error, condition) {
    if (error) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: error.message
      });
    }

    const withUser: boolean = !!req.query.withUser;
    CommentTree.getArticlesWithCommentOfTree(condition, withUser, (err, doc) => {
      if (err) {
        return res.status(500).json({
          title: v.MESSAGE.default,
          error: err.message
        });
      }
      return res.status(200).json(doc);
    });
  });
});


// 検索条件にauthorUserIdの指定がある場合はユーザ情報を取得して_idに変換する
function getCondition(req: any, cb: Function): void {
  const query = req.query;
  const source = query.condition ?
    JSON.parse(query.condition) :
    {};

  // 削除記事は除外
  const factors: Array<Object> = [];
  factors.push({
    deleted: { $exists : false }
  });

  const condition = {$match: {
    $and: factors
  }};

  const userIds = source.author && source.author.userId;
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

      factors.push({
        author: {
          $in: users.map(user => user._id)
        }
      });

      return cb(null, condition);
    });
  }


  const _ids = source.author && source.author._id;
  if (_ids) {
    if (_ids instanceof Array) {
      factors.push({
        author: {
          $in: _ids.map(id =>  new mongoose.Types.ObjectId(id))
        }
      });
    } else {
      factors.push({
        author: new mongoose.Types.ObjectId(_ids)
      });
    }
  }

  if (source.dateFrom) {
    factors.push({
      created: {
        $gte: new Date(source.dateFrom)
      }
    });
  }


  if (source.dateTo) {
    factors.push({
      created: {
        $lte: new Date(source.dateTo)
      }
    });
  }

  return cb(null, condition);
}


// 一件検索
articleRouter.get('/:_id', (req, res, next) => {
  const condition = {
    _id: req.params._id,
    deleted: { $exists : false } // 削除記事は除外
  };

  if (req.query.withUser) {
    Article
      .find(condition)
      .populate('author', '-password')
      .populate('vote', '-password')
      .exec(cbFind);
  } else {
    Article
      .find(condition)
      .exec(cbFind);
  }

  function cbFind(err, doc): any {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(500).json({
        title: `記事(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0]);
  }
});


// 登録
articleRouter.post('/', [
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

  const article = new Article();
  article.title = req.body.title;
  article.isMarkdown = req.body.isMarkdown;
  article.body = req.body.body;
  article.created = new Date();

  article.save((err, target) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を登録しました。`,
      obj: target
    });
  });
});


// 入力チェック用
function isNotExisted(_id: String): Promise<boolean> {
  return Article
  .findOne({ _id: _id, deleted: { $exists : false }})
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
  return Article
  .findOne({ _id: _id, deleted: { $exists : false }})
  .exec()
  .then(user => {
    // 削除されてないものが存在すればOK
    if (user && !user.deleted) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }).catch(err => Promise.reject(false));
}




// 更新（差分更新）
articleRouter.put('/:_id', [
  // 形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotExisted).withMessage(v.message(v.MESSAGE.not_existed, ['記事'])),
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

  const article = req.body;
  delete article.created;
  article.updated = new Date();

  Article.findByIdAndUpdate(req.params._id, {$set: article }, {new: true}, (err, target) => {
    // 更新対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
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
articleRouter.delete('/:_id', [
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(isNotDeleted).withMessage(v.message(v.MESSAGE.not_existed, ['記事'])),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sysdate = new Date();
  Article.findByIdAndUpdate(req.params._id, {$set: {updated: sysdate, deleted: sysdate }}, {new: true}, (err, target) => {
    // 削除対象の存在チェックは入力チェックで実施済みなのでここでは特に対象しない

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を削除しました。`,
      obj: target
    });
  });
});


// いいね登録
articleRouter.post('/:_id/vote', (req, res, next) => {
  const _idOfUser = req.body.voter;

  Article.update({
    _id: req.params._id
  }, {$push: {
    vote: new mongoose.Types.ObjectId(_idOfUser)
  } }, (err, result) => {

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: '記事にいいねしました。',
      obj: result
    });
  });
});

// いいね削除
articleRouter.delete('/:_id/vote/:_idOfVorter', (req, res, next) => {

  Article.update({
    _id: req.params._id
  }, {$pull: {
    vote: new mongoose.Types.ObjectId(req.params._idOfVorter)
  } }, (err, result) => {

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: 'いいねを取り消しました。',
      obj: result
    });
  });
});


// 複数件検索
articleRouter.get('/:_id/vote', (req, res, next) => {

  const condition = {
    _id: req.params._id,
    deleted: { $exists : false } // 削除記事は除外
  };

  Article
    .find(condition)
    .populate('vote', '-password')
    .exec(cbFind);

  function cbFind(err, doc): any {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE.default,
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(500).json({
        title: `記事(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0].vote);
  }
});

export { articleRouter };
