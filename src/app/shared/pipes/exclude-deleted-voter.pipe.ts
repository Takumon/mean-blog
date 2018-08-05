import { Pipe, PipeTransform } from '@angular/core';

import { UserModel } from '../models/user.model';

// いいねしたユーザリストから削除済みユーザを除外
@Pipe({ name: 'excludeDeletedVoter'})
export class ExcludeDeletedVoterPipe implements PipeTransform {
  transform(voters: Array<UserModel>, args?) {

    if (!voters) {
      return voters;
    }

    return voters.filter(voter => {
      return !voter.deleted;
    });
  }
}
