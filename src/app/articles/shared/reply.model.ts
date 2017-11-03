export class ReplyModel {
  _id: string;
  // 元記事の_id
  articleId: string;
  // リプライ先のコメントの_id
  commentId: string;
  text: string;
  // コメントしたユーザの_id
  user: string;
  created: string;
  update: string;

  // 表示制御用
  isEditable: boolean;
  addReply: boolean;
}
