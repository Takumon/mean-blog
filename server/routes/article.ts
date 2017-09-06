import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';

import { Article } from '../models/article';
import { Comment } from '../models/comment';
import { CommentTree } from '../helpers/comment-tree';
import { User } from '../models/user';


const articleRouter: Router = Router();

// 全記事を取得する
articleRouter.get('/', (req, res, next) => {

  getCondition(req, function(error, condition) {
    if (error) {
      return res.status(500).json({
        title: 'エラーが発生しました。',
        error: error.message
      });
    }

    const withUser: boolean = !!req.query.withUser;
    CommentTree.getArticlesWithCommentOfTree(condition, withUser, (err, doc) => {
      if (err) {
        return res.status(500).json({
          title: 'エラーが発生しました。',
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

  const factors = [];
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

  return cb(null, factors.length > 0 ? condition : null);
}


// 指定したIDの記事を取得する
articleRouter.get('/:_id', (req, res, next) => {
  // 記事検索
  if (req.query.withUser) {
    Article
      .find({ _id: req.params._id })
      .populate('author', '-password')
      .exec(cbFind);
  } else {
    Article
      .find({ _id: req.params._id })
      .exec(cbFind);
  }

  function cbFind(err, doc): void {
    if (err) {
      return res.status(500).json({
        title: 'エラーが発生しました。',
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




// 記事を登録する
articleRouter.post('/', (req, res, next) => {
  const article = new Article(req.body);

  article.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を登録しました。',
      obj: result
    });
  });
});

// 記事を更新する（差分更新）
articleRouter.put('/:_id', (req, res, next) => {
  Article.update({
    _id: req.params._id
  }, {$set: req.body }, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を更新しました。',
      obj: result
    });
  });
});

// 記事を削除する
articleRouter.delete('/:_id', (req, res, next) => {
  Article.findOne({
    _id: req.params._id
  }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした記事(_id=${req.params.id})が見つかりませんでした。',
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
        message: '記事を削除しました。',
      });
    });
  });
});

export { articleRouter };
