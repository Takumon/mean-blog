import { UserModel } from '../../users/shared/user.model';

export class CommentWithUserModel {
  articleId: number;
  text: string;
  isMarkdown: boolean;
  user: UserModel;
  created: string;
  update: string;
}
