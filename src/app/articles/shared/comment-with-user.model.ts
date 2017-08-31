import { UserModel } from '../../users/shared/user.model';

export class CommentWithUserModel {
  _id: string;
  articleId: string;
  text: string;
  parentId: string;
  user: UserModel;
  created: string;
  updated: string;

  // 表示制御用
  depth: number;
  isEditable: boolean;
  addReply: boolean;
}
