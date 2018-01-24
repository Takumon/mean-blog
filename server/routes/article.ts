import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';

import { validateHelper as v } from '../helpers/validate-helper';
import { Article } from '../models/article.model';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';
import * as ENV from '../environment-config';

const MODEL_NAME = '記事';
const router: Router = Router();

// 複数件検索
router.get('/', (req, res, next) => {
  extractCondition(req, function(error: any, condition: ArticleCondition) {
    if (error) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: error.message
      });
    }

    const pagingOptions = extractPagingOptions(req);

    Article
    .find(condition)
    .populate('author', 'userId userName deleted')
    .populate('image', '_id fileName')
    .populate({
      path: 'vote',
      select: 'userId userName deleted',
      options: { sort: { created: 1 }},
    })
    .populate({
      path: 'comments',
      options: {
        deleted: {$eq: null},
        sort: { created: 1 }
      },
      populate: [{
        path: 'user',
        select: 'userId userName deleted',
      }, {
        path: 'replies',
        options: { sort: { created: 1 }},

        populate: {
          path: 'user',
          select: 'userId userName deleted',
        }
      }],
    })
    .sort(pagingOptions.sort)
    .exec((err, allArticles) => {

      if (err) {
        return res.status(500).json({
          title: v.MESSAGE_KEY.default,
          error: err.message
        });
      }

      removeDeletedUserCommentAndVote(allArticles);

      const count = allArticles.length;
      const articles = allArticles.slice(pagingOptions.skip, pagingOptions.skip + pagingOptions.limit);

      return res.status(200).json({count, articles});
    });
  });
});


/**
 * 指定した記事一覧から削除済みユーザのコメントといいねを除去する
 *
 * @param articles 記事一覧
 */
function removeDeletedUserCommentAndVote(articles: any): void {
  // 削除ユーザのコメントを削除
  articles.filter(a => a.comments && a.comments.length > 0).forEach( (a, indexOfArticles, articlesList) => {

    // 削除ユーザのリプライを削除
    const temp = a.comments.filter(c => !c.user.deleted);

    temp.filter(c => c.replies && c.replies.length > 0).forEach( (c, indexOfComments , commentsList) => {
      commentsList[indexOfComments].replies = c.replies.filter(r => !r.user.deleted);
    });

    articlesList[indexOfArticles].comments = temp;
  });

  // 削除ユーザのいいねを削除
  articles.filter(a => a.vote && a.vote.length > 0).forEach((a, i , articlesList) => {
    articlesList[i].vote = a.vote.filter(voter => !voter.deleted);
  });
}


interface ArticleCondition {
  author?: any;
  vote?: any;
  created?: any;
  deleted: any;
}

/**
 * 指定されたリクエストから検索条件を組み立てる
 *
 * @param req リクエストオブジェクト
 * @param cb コールバック関数
 */
function extractCondition(req: any, cb: (error: any, condition: ArticleCondition) => void): void {
  const query = req.query;
  const source = query.condition ?
    JSON.parse(query.condition) :
    {};

  const condition: ArticleCondition = {
    deleted: { $eq: null}  // 削除記事は除外
  };

  // ユーザのuserIdで絞り込み
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

      condition.author =  {
        $in: users.map(user => user._id)
      };

      return cb && cb(null, condition);
    });
  }

  // 投稿者の_idで絞り込み
  const _ids = source.author && source.author._id;
  if (_ids) {
    if (_ids instanceof Array) {
      condition.author = {
        $in: _ids.map(id =>  new mongoose.Types.ObjectId(id))
      };
    } else {
      condition.author = new mongoose.Types.ObjectId(_ids);
    }
  }

  // 記事作成日で絞り込み
  if (source.dateFrom || source.dateTo) {
    condition.created = {};
    if (source.dateFrom) {
      condition.created['$gte'] =  new Date(source.dateFrom);
    }

    if (source.dateTo) {
      condition.created['$lte'] = new Date(source.dateTo);
    }
  }

  // 記事にいいねしたユーザの_idで絞り込み
  const voters = source.voter;
  if (voters) {
    if (voters instanceof Array) {
      condition.vote = {
        $in: voters.map(id =>  new mongoose.Types.ObjectId(id))
      };
    } else {
      condition.vote = {
        $in: [ new mongoose.Types.ObjectId(voters) ]
      };
    }
  }

  return cb && cb(null, condition);
}

/**
 * 指定されたリクエストからページングオプションを組み立てる<br>
 * 指定がない場合は全てデフォルト値が設定される
 */
function extractPagingOptions(req: any): {skip: number, limit: number, sort: Object} {
  const pagingOptions: any = {};

  const source = req.query.condition ?
    JSON.parse(req.query.condition) :
    {};

  pagingOptions.skip = source.skip || 0;
  pagingOptions.limit = source.limit || ENV.LIMIT_PER_PAGE;
  pagingOptions.sort = source.sort || { created: -1};

  return pagingOptions;
}


// 一件検索
router.get('/:_id', (req, res, next) => {
  if ( !req.params._id ||  !req.params._id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      title: `記事(_id=${req.params._id})が見つかりませんでした。`,
    });
  }

  const condition = {
    _id: req.params._id,
    deleted: { $eq: null}  // 削除記事は除外
  };

  if (req.query.withUser) {
    Article
      .find(condition)
      .populate('author', '-password')
      .populate('vote', '-password')
      .populate('image', '_id fileName')
      .exec(cbFind);
  } else {
    Article
      .find(condition)
      .populate('image', '_id fileName')
      .exec(cbFind);
  }

  function cbFind(err, doc): any {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(404).json({
        title: `記事(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(doc[0]);
  }
});



// 登録
router.post('/', [
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['タイトル', '100'])),
  body('author')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['投稿者'])),
  body('author').optional()
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['投稿者'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['本文']))
    .isLength({ max: 10000 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['本文', '10000'])),
  body('image').optional()
  .custom(v.validation.isUniqueImageIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['画像']))
  .custom(v.validation.isExistedImageAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['画像'])),
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.isMarkdown = req.body.isMarkdown;
  article.body = req.body.body;
  article.created = new Date();
  if (req.body.image && req.body.image.length > 0) {
    article.image = req.body.image;
  }

  article.save((err, target) => {
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
  // 形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(v.validation.isExistedArticle).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['記事'])),
  body('title')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['タイトル']))
    .isLength({ max: 100 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['タイトル', '100'])),
  body('isMarkdown')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['記事形式'])),
  body('body')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['本文']))
    .isLength({ max: 10000 }).withMessage(v.message(v.MESSAGE_KEY.maxlength, ['本文', '10000'])),
  body('image').optional()
    .custom(v.validation.isUniqueImageIdList).withMessage(v.message(v.MESSAGE_KEY.not_unique, ['画像']))
    .custom(v.validation.isExistedImageAll).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['画像'])),
  ], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const model = {};
  const article = req.body;
  delete article.created;
  article.updated = new Date();

  model['$set'] = article;


  if (!article.image || article.image.length === 0) {
    delete article.image;
    model['$unset'] = { image: '1'};
  }


  Article.findByIdAndUpdate(req.params._id, model, {new: true}, (err, target) => {
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
  // ユーザIDの形式チェックは行わず存在するかだけを確認する
  param('_id')
    .custom(v.validation.isExistedArticle).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['記事'])),
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


// いいね登録
router.post('/:_id/vote', [
  body('voter')
    .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['いいねの投稿者'])),
  body('voter').optional({checkFalsy: true})
    .custom(v.validation.isNotExistedVote).withMessage(v.message(v.MESSAGE_KEY.allready_existed, ['いいね']))
    .custom(v.validation.isExistedUser).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['いいねの投稿者'])),
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
  }

  const _idOfUser = req.body.voter;

  Article.update({
    _id: req.params._id
  }, {$push: {
    vote: new mongoose.Types.ObjectId(_idOfUser)
  } }, (err, article) => {

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: '記事にいいねしました。',
      obj: article.vote
    });
  });
});

// いいね削除
router.delete('/:_id/vote/:_idOfVorter', [
  param('_idOfVorter')
    .custom(v.validation.isExistedVote).withMessage(v.message(v.MESSAGE_KEY.not_existed, ['いいね'])),
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Article.update({
    _id: req.params._id
  }, {$pull: {
    vote: new mongoose.Types.ObjectId(req.params._idOfVorter)
  } }, (err, article) => {

    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    return res.status(200).json({
      message: 'いいねを取り消しました。',
      obj: article.vote
    });
  });
});


// 複数件検索
router.get('/:_id/vote', (req, res, next) => {

  const condition = {
    _id: req.params._id,
    deleted: { $eq: null}  // 削除記事は除外
  };

  Article
    .find(condition)
    .populate('vote', '-password')
    .exec(cbFind);

  function cbFind(err, articles): any {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    if (!articles[0]) {
      return res.status(500).json({
        title: `記事(_id=${req.params._id})が見つかりませんでした。`,
      });
    }

    return res.status(200).json(articles[0].vote);
  }
});

export { router as articleRouter };
