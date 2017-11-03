import { UserModel } from '../../users/shared/user.model';
import { ReplyWithUserModel } from '../shared/reply-with-user.model';

export class CommentWithUserModel {
  _id: string;
  articleId: string;
  text: string;
  parentId: string;
  user: UserModel;
  created: string;
  updated: string;
  deleted: string;
  replies: Array<ReplyWithUserModel>;

  // 表示制御用
  isEditable: boolean;
  addReply: boolean;
}
