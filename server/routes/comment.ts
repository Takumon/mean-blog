import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { Comment } from '../models/comment';
import { CommentTree } from '../helpers/comment-tree';

const commentRouter: Router = Router();


// 全コメントを取得する
commentRouter.get('/', (req, res, next) => {
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
  const condition = query.condition ?
    JSON.parse(query.condition) :
    {};

  if (query.withUser) {
    Comment
      .find(condition)
      .populate('user', '-password')
      .exec(cb);
  } else {
    Comment
      .find(condition)
      .exec(cb);
  }
});

// コメントを登録する
commentRouter.post('/', (req, res, next) => {
  const comment = new Comment(req.body);

  comment.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'コメントを登録しました。',
      obj: result
    });
  });
});

// コメントを更新する
commentRouter.put('/:commentId', (req, res, next) => {

  Comment.update({
    _id: req.params.commentId
  }, req.body, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'コメントを更新しました。',
      obj: result
    });
  });
});

// 指定したIDのコメントを削除する
// 子孫含めて削除
commentRouter.delete('/:commentId', (req, res, next) => {

  const cbAggregate = (error, commentWithChild) => {
    if (error) {
      return res.status(500).json({
        title: `コメント(_id=${req.params.commentId})の子コメント取得時にエラーが発生しました。`,
        error: error.message
      });
    }

    // TODO AggregateCursor#eachの使用方法がいまいちわからないので調査
    if (commentWithChild) {
      const deleteCommentIds = commentWithChild.childCommentIds;
      deleteCommentIds.push(commentWithChild._id);

      Comment.remove({_id: {$in: deleteCommentIds}}, cbRemoveComments);
    }
  };

  const cbRemoveComments = (error, removed) => {
    if (error) {
      return res.status(500).json({
        title: 'コメント(_id=${req.params.commentId})が削除できませんでした。',
        error: error.message
      });
    }

    return res.status(200).json({
      message: 'コメントを削除しました。',
      removed: removed
    });
  };

  // 削除対象コメントを検索
  Comment.aggregate([
    { $match : {
      _id : mongoose.Types.ObjectId(req.params.commentId),
    }},
    // 子コメントを再帰的に検索
    { $graphLookup: {
      from: 'comments',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'parentId',
      as: 'replies'
    }},
    // 子コメントの_id(replies._id)の配列を生成
    {$unwind: {
      path: '$replies',
      preserveNullAndEmptyArrays: true
    }},
    { $group : { _id: '$_id', childCommentIds : {$push: '$replies._id'} }}
  ])
  .cursor({ batchSize: 1000 })
  .exec()
  .each(cbAggregate);
});


// 記事に紐付くコメントを
// ツリー構造の順にソートしdepthを追加した配列にして取得する
commentRouter.get('/ofArticle/:_idOfArticle', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  };


  const withUser: boolean = !!req.query.withUser;
  const _idOfArticle: mongoose.Types.ObjectId = mongoose.Types.ObjectId(req.params._idOfArticle);
  CommentTree.getCommentOfTree(_idOfArticle, withUser, cb);
});



export { commentRouter };
