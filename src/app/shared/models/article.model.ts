import { CommentModel } from './comment.model';
import { ImageModel } from '../models/image.model';

/**
 * 記事のモデル
 */
export class ArticleModel {
  /** id */
  _id: string;
  /** 記事タイトル */
  title: string;
  /** 記事本文 */
  body: string;
  /** 記事がマークダウン形式か(trueの場合はマークダウン形式、falseの場合はプレーンテキスト形式) */
  isMarkdown: boolean;
  /** 記事投稿者のユーザ */
  author: string;
  /** 記事に対するコメント(コメントしたユーザ情報を含む）のリスト */
  comments?: Array<CommentModel>;
  /** 記事本文で使用している画像情報のリスト */
  image?: Array<ImageModel>;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** （論理）削除日時 */
  deleted?: string;
}

