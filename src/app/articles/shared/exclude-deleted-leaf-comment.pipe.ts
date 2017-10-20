import { Pipe, PipeTransform } from '@angular/core';

import { CommentWithUserModel } from './comment-with-user.model';

@Pipe({ name: 'excludeDeletedLeafComment'})
export class ExcludeDeletedLeafCommentPipe implements PipeTransform {
  transform(comments: Array<CommentWithUserModel>, args?) {

    if (!comments) {
      return comments;
    }

    const result = comments.filter(c => {
      return !this.isDeletedLeafComment(c);
    });
    return result;
  }

  isDeletedLeafComment(c: CommentWithUserModel): boolean {
    return (c.deleted || c.userDeleted) && !c.hasUndeletedChildren;
  }
}
