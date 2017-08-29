import * as http from 'http';
import { Router, Response } from 'express';
import * as mongoose from 'mongoose';

import { Article } from '../models/article';
import { Comment } from '../models/comment';


const articleRouter: Router = Router();

// 全記事を取得する
articleRouter.get('/', (req, res, next) => {
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
    Article
      .find(condition)
      .populate('author', '-password')
      .exec(cb);
  } else {
    Article
      .find(condition)
      .exec(cb);
  }
});

// 指定したIDの記事を取得する
articleRouter.get('/:id', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
        title: 'エラーが発生しました。',
        error: err.message
      });
    }

    if (!doc[0]) {
      return res.status(500).json({
        title: `記事(articleId=${req.params.id})が見つかりませんでした。`,
      });
    }

    const article = doc[0];

    const commentsHolder = [];
    // 記事に紐づくコメントを取得
    Comment.aggregate([
      { $match : {
        articleId : article._id.toString(),
        // parentId: {$exists: false}
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
      {$unwind: {
        path: '$replies',
        preserveNullAndEmptyArrays: true
      }},
      { $sort: {
        'created': 1,
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
      // TODO アイコンサイズ
      { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } }
    ])
    .cursor({ batchSize: 100 })
    .exec()
    .each(function(error, commentWithChild) {
      if (error) {
        return res.status(500).json({
          title: `記事(articleId=${req.params.id})のコメント取得時にエラーが発生しました。`,
        });
      }

      if (commentWithChild) {
        commentsHolder.push(commentWithChild);
      } else {
        const articleObj = article.toObject();
        articleObj.comments = treeSort(commentsHolder);
        return res.status(200).json(articleObj);
      }
    });
  };


  if (req.query.withUser) {
    Article
      .find({ articleId: +req.params.id })
      .populate('author', '-password')
      .exec(cb);
  } else {
    Article
      .find({ articleId: +req.params.id })
      .exec(cb);
  }
});

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

function setComments(article) {
  const articleId = article._id;


  Comment.aggregate(
    [
      // 親コメントを取得
      { '$match': { 'parentId': {$exists: false} } },
      // 子コメントを再帰的に検索
      { $graphLookup: {
        from: 'vwComment',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentId',
        as: 'replies"'
      }},
    ],
    function (err, result) {
      if (err) {
          console.log(err);
          return;
      }
      console.log(result);
    }
  );
}

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

// 記事を更新する
articleRouter.put('/:id', (req, res, next) => {
  Article.update({
    articleId: req.params.id
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
articleRouter.delete('/:id', (req, res, next) => {
  Article.findOne({ articleId: req.params.id }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした記事(articleId=${req.params.id})が見つかりませんでした。',
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
