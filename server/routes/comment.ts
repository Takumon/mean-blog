import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';
import { Comment } from '../models/comment';

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
        title: '削除しようとしたコメント(articleId=${req.params.id})が削除できませんでした。',
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
    console.log(err);
    console.log(doc);
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  };


  const withUser: boolean = !!req.query.withUser;
  getCommentOfTree(req.params._idOfArticle, withUser, cb);
});

/**
 * 指定した記事の_idにひもづくコメントを
 * ツリー構造の順にソートしdepthを追加した配列にして取得する
 *
 * @param _idOfArticle 記事の_id
 * @param withUser レスポンスにコメントしたユーザ情報を含めるか
 * @param cb コールバック関数(第一引数はerror, 第二引数はcomments)
 */
function getCommentOfTree(_idOfArticle: string, withUser: boolean, cb: Function): void {
  // 検索条件
  const pipeline: Array<Object> = [
    { $match : {
      articleId : _idOfArticle,
    }},
    // 子コメントを再帰的に検索
    { $graphLookup: {
      from: 'comments',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'parentId',
      maxDepth: 0,
      as: 'replies'
    }},
    // 子コメントを日付昇順でソート（配列なので一旦バラしてソート後にグルーピング）
    {$unwind: {
      path: '$replies',
      preserveNullAndEmptyArrays: true
    }},
    { $sort: {
      'replies.created': 1}},
    {$group: {
      _id: '$_id',
      articleId: { $first: '$articleId'},
      parentId: { $first: '$parentId'},
      text: { $first: '$text'},
      user: { $first: '$user'},
      created: { $first: '$created'},
      updated: { $first: '$updated'},
      'replies': {$push: '$replies._id'}
    }},
    // 親コメントは日付昇順に度ソート
    { $sort: {
      'created': 1,
      'replies.created': 1}},
  ];


  if (withUser) {
    // ユーザ取得処理を追加
    pipeline.push(
      // TODO アイコンサイズ
      { $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } });
  }

  // 記事に紐づくコメントを取得
  Comment
    .aggregate(pipeline)
    .cursor({ batchSize: 100 })
    .exec()
    .each(cbAggregate);

  const commentsHolder = [];
  function cbAggregate(error, commentWithChild): void {
    if (error) {
      cb(error, commentWithChild);

      // return res.status(500).json({
      //   title: `記事(articleId=${_idOfArticle})のコメント取得時にエラーが発生しました。`,
      // });
    }

    if (commentWithChild) {
      commentsHolder.push(commentWithChild);
    } else {
      cb(error, treeSort(commentsHolder));
    }
  }
}

/**
 * 子コメントの参照を持つコメント配列をインプットに
 * コメントツリー構造の順にソートしdepthを追加する
 *
 * @param inputComments 子コメントの参照を持つコメント配列
 */
function treeSort(inputComments: Array<any>): Array<any> {
  const outputComments = [];

  for (const c of inputComments) {

    // トップ階層以外のコメントは除外
    if (c.parentId !== null) { continue; }

    const topLevelComment = c;
    topLevelComment.depth = 0;

    outputComments.push(topLevelComment);
    setReplies(topLevelComment, inputComments, outputComments);
  }

  return outputComments;
}

/**
 * 引数のコメントにリプライコメント配列をセットする
 *
 * @param comment コメント(depthは定義済み)
 * @param inputComments 子コメントの参照を持つコメント配列
 */
function setReplies(comment: any, inputComments: Array<any>, outputComments: Array<any>): void {
  if (!comment.replies || comment.replies.length === 0) {
    delete comment.replies;
    return;
  }

  // repliesは生成日時の昇順でソート済みの想定
  for (const replyId of comment.replies) {
    const reply = getReply(replyId, inputComments);
    reply.depth = comment.depth + 1;
    // リプライをコメントにセット
    outputComments.push(reply);
    // 再帰呼び出しで、リプライのリプライをセット
    setReplies(reply, inputComments, outputComments);
  }

  delete comment.replies;
}

/**
 * コメント配列から指定した_idのコメントを取得する
 *
 * @param _id
 * @param comments
 */
function getReply( _id: any, comments: Array<any>): any {
  for (const comment of comments) {
    // そのままの比較だと上手くいかない
    if (_id.toString() === comment._id.toString()) {
      return comment;
    }
  }
}

export { commentRouter };
