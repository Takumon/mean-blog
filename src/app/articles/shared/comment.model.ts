export class CommentModel {
  _id: string;
  // 元記事の_id
  articleId: string;
  // 親コメントの_id
  parentId: string;
  text: string;
  // コメントしたユーザの_id
  user: string;
  created: string;
  update: string;
}
