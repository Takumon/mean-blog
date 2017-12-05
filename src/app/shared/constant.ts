export class Constant {
  /** ヘッダに表示するアプリのタイトル */
  public static APP_TITLE = 'Material Blog';
  /** 目次タイトルのHeaderの大きさに応じたインデント幅の間隔 */
　public static TOC_INDENT_INTERVAL = 12;
  /** ツールチップを遅れて表示する場合のディレイタイム(msec) */
  public static TOOL_TIP_SHOW_DELAY = 500;
  /** スナックバーのデフォルトオプション */
  public static SNACK_BAR_DEFAULT_OPTION = {duration: 3000};
  /** POST送信時に指定するコンテンツタイプ */
  public static POST_CONTENT_TYPE = 'application/x-www-form-urlencoded';
  /** 画像遅延表示ときのoffset */
  public static LAZY_LOAD_OFFSET = 50;
  /** １ユーザが登録できる下書きの最大件数 */
  public static MAX_DRAFT_COUNT = 10;
}
