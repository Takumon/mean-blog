import { Pipe, PipeTransform } from '@angular/core';

import { CommentWithUserModel } from './comment-with-user.model';

@Pipe({ name: 'excludeDeletedComment'})
export class ExcludeDeletedCommentPipe implements PipeTransform {
  transform(comments: Array<CommentWithUserModel>, args?) {

    if (!comments) {
      return comments;
    }

    return comments.filter(c => {
      return !c.deleted && !c.user.deleted;
    });
  }
}
