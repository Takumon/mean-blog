import { UserModel } from '../../users/shared/user.model';
import { ReplyWithUserModel } from '../shared/reply-with-user.model';

/**
 * コメント(コメントしたユーザ情報、リプライ情報を含む)のモデル
 */
export class CommentWithUserModel {
  /** id */
  _id: string;
  /** 元記事の_id */
  articleId: string;
  /** コメント本文 */
  text: string;
  /*+ コメントしたユーザのモデル */
  user: UserModel;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** （論理）削除日時 */
  deleted?: string;
  /** コメントに対するリプライモデルの配列 */
  replies: Array<ReplyWithUserModel>;

  /** （表示制御用）編集中か */
  isEditable?: boolean;
  /** （表示制御様）本コメントに対してリプライを追加しようとしているか */
  addReply?: boolean;
}
