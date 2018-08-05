/**
 * コメントのモデル
 */
export class CommentModel {
  /** id */
  _id: string;
  /** 元記事の_id */
  articleId: string;
  /** コメント本文 */
  text: string;
  /*+ コメントしたユーザの_id */
  user: string;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** （論理）削除日時 */
  deleted?: string;
}
