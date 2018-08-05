import { UserModel } from './user.model';
import { ArticleWithUserModel } from './article-with-user.model';

/**
 * リプライ(リプライしたユーザの情報、リプライした記事情報を含む)のモデル
 */
export class ReplyWithArticleModel {
  /** id */
  _id: string;
  /** 元記事のモデル */
  articleId: ArticleWithUserModel;
  /** リプライ本文 */
  text: string;
  /** リプライしたユーザのモデル */
  user: UserModel;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** リプライ先のコメントの_id */
  commentId: string;
}
