/**
 * リプライコメントのモデル
 */
export class ReplyModel {
  _id: string;
  /** 元記事の_id */
  articleId: string;
  /** リプライ先のコメントの_id */
  commentId: string;
  /** リプライコメント */
  text: string;
  /*+ コメントしたユーザの_id */
  user: string;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;

  /** （表示制御用）編集可能か */
  isEditable?: boolean;
  /** （表示制御様）本リプライに対してリプライをしようとしているか */
  addReply?: boolean;
}
