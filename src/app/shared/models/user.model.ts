/**
 * ユーザ情報のモデル
 */
export class UserModel {
  /** id */
  _id: string;
  /**
   * ユーザを一意に識別するためのID<br>
   * _idは無意味な文字の羅列だがユーザIDは意味がある文字列(ユーザ登録時にユーザが指定する)
   */
  userId: string;
  /**
   * パスワード(暗号化済)<br>
   * セキュリティの問題上サーバ側から送信されないこともあるので必須ではない
   */
  password?: string;
  /** メールアドレス */
  email?: string;
  /** ユーザ名 */
  userName?: string;
  /** 管理者権限か(treuの場合は管理者,falseの場合は一般ユーザ) */
  isAdmin: boolean;
  /** ブログタイトル */
  blogTitle?: string;
  /** 自己紹介 */
  userDescription?: string;
  /** 登録日時 */
  created: string;
  /** 更新日時 */
  updated: string;
  /** 削除日時 */
  deleted?: string;
}
