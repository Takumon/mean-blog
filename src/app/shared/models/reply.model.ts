/**
 * リプライコメントのモデル
 */
export class ReplyModel {
  _id: string;
  /** 元記事の_id */
  articleId: string;
  /** リプライコメント本文 */
  text: string;
  /*+ コメントしたユーザ情報の_id */
  user: string;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** リプライ先のコメントの_id */
  commentId: string;

  /** （表示制御用）編集中か */
  isEditable?: boolean;
  /** （表示制御様）リプライに対してリプライを追加しようとしているか */
  addReply?: boolean;
}
