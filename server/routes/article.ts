import * as http from 'http';
import { Router, Response } from 'express';

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
        title: `記事(articleId=${req.params._id})が見つかりませんでした。`,
      });
    }

    const article = doc[0];
    setCommentsAndReturnResponse(article);
  }


  function setCommentsAndReturnResponse(article): void {
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
      // ユーザ情報を追加
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
    .each(cbAggregate);

    function cbAggregate(error, commentWithChild): void {
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
    }
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
