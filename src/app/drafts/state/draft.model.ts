import { ImageModel } from '../../shared/models';

/**
 * 下書き記事のモデル
 */
export class DraftModel {
  /** id */
  _id: string;
  /** 記事タイトル */
  title: string;
  /** 記事本文 */
  body: string;
  /** 記事がマークダウン形式か(trueの場合はマークダウン形式、falseの場合はプレーンテキスト形式) */
  isMarkdown: boolean;
  /** 記事投稿者のユーザ情報 */
  author: string;
  /** 下書き対象記事のID(投稿済み記事の下書きの場合に保持する) */
  articleId?: string;
  /** 記事本文で使用している画像情報のリスト */
  image?: Array<ImageModel>;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
}
