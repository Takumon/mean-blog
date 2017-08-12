import { UserModel } from '../../users/shared/user.model';

export class CurrentUserModel {
  user: UserModel;
  token: string;
}
