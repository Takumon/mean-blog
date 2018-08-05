import { UserModel } from '../models/user.model';
import { ArticleWithUserModel } from './article-with-user.model';

/**
 * コメント(コメントしたユーザ情報、コメントした記事情報を含む)のモデル
 */
export class CommentWithArticleModel {
  /** id */
  _id: string;
  /** 元記事のモデル */
  articleId: ArticleWithUserModel;
  /** コメント本文 */
  text: string;
  /** コメントしたユーザのモデル */
  user: UserModel;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** （論理）削除日時 */
  deleted?: string;
}
