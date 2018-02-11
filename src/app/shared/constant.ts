export class Constant {
  /** ヘッダに表示するアプリのタイトル */
  public static readonly APP_TITLE = 'Material Blog';
  /** 目次タイトルのHeaderの大きさに応じたインデント幅の間隔 */
　public static readonly TOC_INDENT_INTERVAL = 12;
  /** ツールチップを遅れて表示する場合のディレイタイム(msec) */
  public static readonly TOOL_TIP_SHOW_DELAY = 500;
  /** スナックバーのデフォルトオプション */
  public static readonly SNACK_BAR_DEFAULT_OPTION = {duration: 3000};
  /** POST送信時に指定するコンテンツタイプ */
  public static readonly POST_CONTENT_TYPE = 'application/x-www-form-urlencoded';
  /** 画像遅延表示ときのoffset */
  public static readonly LAZY_LOAD_OFFSET = 50;
  /** １ユーザが登録できる下書きの最大件数 */
  public static readonly MAX_DRAFT_COUNT = 10;
  /** ページング機能：デフォルトの１件あたりの表示件数 */
  public static readonly DEFAULT_PER_PAGE = 20;
  /** ページング機能：選択可能な１件あたりの表示件数 */
  public static readonly DEFAILT_PER_PAGES = [20, 50, 100];
}
