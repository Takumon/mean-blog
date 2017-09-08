import { UserModel } from '../../users/shared/user.model';

export class CommentWithUserModel {
  _id: string;
  articleId: string;
  text: string;
  parentId: string;
  user: UserModel;
  created: string;
  updated: string;
  deleted: string;

  // 表示制御用
  depth: number;
  hasChildren: boolean;
  hasUndeletedChildren: boolean;
  isEditable: boolean;
  addReply: boolean;

}
