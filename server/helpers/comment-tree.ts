import { Comment } from '../models/comment';

/**
 * ツリー構造のコメントを取得するためのユーティリティ
 */
class CommentTreeClass {

  /**
   * 指定した記事の_idにひもづくコメントを
   * ツリー構造の順にソートしdepthを追加した配列にして取得する
   *
   * @param _idOfArticle 記事の_id
   * @param withUser レスポンスにコメントしたユーザ情報を含めるか
   * @param cb コールバック関数(第一引数はerror, 第二引数はcomments)
   */
  getCommentOfTree(_idOfArticle: string, withUser: boolean, cb: Function): void {
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

    const commentsHolder = [];

    // 記事に紐づくコメントを取得
    Comment
      .aggregate(pipeline)
      .cursor({ batchSize: 100 })
      .exec()
      .each((error, commentWithChild) => {
        if (error) {
          cb(error, commentWithChild);
        }

        if (commentWithChild) {
          commentsHolder.push(commentWithChild);
        } else {
          cb(error, this.treeSort(commentsHolder));
        }
      });

  }

  /**
   * 子コメントの参照を持つコメント配列をインプットに
   * コメントツリー構造の順にソートしdepthを追加する
   *
   * @param inputComments 子コメントの参照を持つコメント配列
   */
  private treeSort(inputComments: Array<any>): Array<any> {
    const outputComments = [];

    for (const c of inputComments) {

      // トップ階層以外のコメントは除外
      if (c.parentId !== null) { continue; }

      const topLevelComment = c;
      topLevelComment.depth = 0;

      outputComments.push(topLevelComment);
      this.setReplies(topLevelComment, inputComments, outputComments);
    }

    return outputComments;
  }

  /**
   * 引数のコメントにリプライコメント配列をセットする
   *
   * @param comment コメント(depthは定義済み)
   * @param inputComments 子コメントの参照を持つコメント配列
   */
   private setReplies(comment: any, inputComments: Array<any>, outputComments: Array<any>): void {
    if (!comment.replies || comment.replies.length === 0) {
      delete comment.replies;
      return;
    }

    // repliesは生成日時の昇順でソート済みの想定
    for (const replyId of comment.replies) {
      const reply = this.getReply(replyId, inputComments);
      reply.depth = comment.depth + 1;
      // リプライをコメントにセット
      outputComments.push(reply);
      // 再帰呼び出しで、リプライのリプライをセット
      this.setReplies(reply, inputComments, outputComments);
    }

    delete comment.replies;
  }

  /**
   * コメント配列から指定した_idのコメントを取得する
   *
   * @param _id
   * @param comments
   */
  private getReply( _id: any, comments: Array<any>): any {
    for (const comment of comments) {
      // そのままの比較だと上手くいかない
      if (_id.toString() === comment._id.toString()) {
        return comment;
      }
    }
  }
}

const CommentTree = new CommentTreeClass();

export { CommentTree };
