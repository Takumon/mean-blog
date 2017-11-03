import { UserModel } from '../../users/shared/user.model';

export class ReplyWithUserModel {
  _id: string;
  articleId: string;
  text: string;
  commentId: string;
  user: UserModel;
  created: string;
  updated: string;
}
