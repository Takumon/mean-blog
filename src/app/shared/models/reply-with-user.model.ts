import { UserModel } from '../models/user.model';

/**
 * リプライ(リプライしたユーザ情報を含む)のモデル
 */
export class ReplyWithUserModel {
  /** id */
  _id: string;
  /** 元記事の_id */
  articleId: string;
  /** リプライ本文 */
  text: string;
  /*+ リプライしたユーザ情報のモデル */
  user: UserModel;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** 元コメントの_id */
  commentId: string;
}
