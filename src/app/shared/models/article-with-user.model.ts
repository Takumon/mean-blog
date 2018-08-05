import { UserModel } from '../models/user.model';
import { ImageModel } from '../models/image.model';

import { CommentWithUserModel } from './comment-with-user.model';
import { CommentModel } from './comment.model';

/**
 * 記事(投稿したユーザ情報、いいね情報、コメント情報を含む)のモデル
 */
export class ArticleWithUserModel {
  /** id */
  _id: string;
  /** 記事タイトル */
  title: string;
  /** 記事本文 */
  body: string;
  /** 記事がマークダウン形式か(trueの場合はマークダウン形式、falseの場合はプレーンテキスト形式) */
  isMarkdown: boolean;
  /** 記事投稿者のユーザ情報 */
  author: UserModel;
  /** 記事に対するいいねしたユーザのリスト */
  vote?: Array<UserModel>;
  /** 記事に対するコメント(コメントしたユーザ情報を含む）のリスト */
  comments?: Array<CommentWithUserModel>;
  /** 記事本文で使用している画像情報のリスト */
  image?: Array<ImageModel>;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** （論理）削除日時 */
  deleted?: string;

  /** （表示制御用）記事に対しての新規コメントのモデル*/
  newComment?: CommentModel;
  /** （表示制御用）記事一覧にて記事の詳細(いいねとコメント)を表示するか */
  showDetail?: boolean;
}
