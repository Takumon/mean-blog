import { UserModel } from '../../users/shared/user.model';

export class CommentWithUserModel {
  _id: string;
  articleId: string;
  text: string;
  parentId: string;
  user: UserModel;
  created: string;
  update: string;
}
